import { verifyOrigin } from "@/lib/csrf-protection"
import { fetchPresets, fetchWithTimeout } from "@/lib/fetch-with-timeout"
import { checkIdempotency, generateIdempotencyKey, hashFile, releaseIdempotentRequest } from "@/lib/idempotency"
import { checkCombinedRateLimit, getRateLimitHeaders, rateLimiters } from "@/lib/redis-rate-limiter"
import { fingerprintSchema, processingTypeSchema, sanitizeFilename } from "@/lib/validations/api"
import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const BG_REMOVER_API = "https://api-bgremover.icons8.com/api/v1"
const UPSCALER_API = "https://api-upscaler.icons8.com/api/v1"

function shouldResetCredits(lastReset?: string | null) {
  if (!lastReset) return true
  const now = new Date()
  const last = new Date(lastReset)
  return now.getUTCFullYear() !== last.getUTCFullYear() ||
    now.getUTCMonth() !== last.getUTCMonth() ||
    now.getUTCDate() !== last.getUTCDate()
}

// Use service role for anonymous operations
function getServiceClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function POST(request: NextRequest) {
  try {
    // CSRF protection - verify origin
    const { valid, origin, reason } = verifyOrigin(request)
    if (!valid) {
      console.warn(`[CSRF] Blocked public process request - ${reason || "Unknown"} (Origin: ${origin || "none"})`)
      return NextResponse.json({ message: "Forbidden - Invalid origin" }, { status: 403 })
    }

    const formData = await request.formData()
    const image = formData.get("image") as File
    const type = formData.get("type") as string
    const fingerprint = formData.get("fingerprint") as string

    if (!image) {
      return NextResponse.json({ message: "No image provided" }, { status: 400 })
    }

    // Validate processing type
    const typeValidation = processingTypeSchema.safeParse(type)
    if (!typeValidation.success) {
      return NextResponse.json({ 
        message: typeValidation.error.errors[0]?.message || "Invalid processing type" 
      }, { status: 400 })
    }

    // Validate fingerprint
    if (!fingerprint) {
      return NextResponse.json({ message: "Fingerprint required" }, { status: 400 })
    }

    const fingerprintValidation = fingerprintSchema.safeParse(fingerprint)
    if (!fingerprintValidation.success) {
      return NextResponse.json({ 
        message: "Invalid fingerprint format" 
      }, { status: 400 })
    }

    // Generate idempotency key using file hash + type + fingerprint
    const fileHash = await hashFile(image)
    const idempotencyKey = generateIdempotencyKey(fingerprint, "process", {
      type,
      fileHash,
    })

    // Check idempotency to prevent race conditions
    const idempotencyCheck = await checkIdempotency(idempotencyKey)

    if (!idempotencyCheck.allowed) {
      if (idempotencyCheck.status === "processing") {
        return NextResponse.json(
          { 
            message: "Request is already being processed. Please wait.",
            status: "processing"
          },
          { status: 409 }
        )
      }

      if (idempotencyCheck.status === "completed" && idempotencyCheck.result) {
        // Return cached result
        return NextResponse.json(idempotencyCheck.result)
      }
    }

    // Sanitize filename to prevent directory traversal
    const sanitizedFilename = sanitizeFilename(image.name)

    // Server-side file validation
    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB max for free users
    if (image.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        message: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB. Sign up for larger uploads!` 
      }, { status: 413 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json({ 
        message: "Invalid file type. Only JPEG, PNG, and WebP are allowed" 
      }, { status: 400 })
    }

    // Rate limiting - Check both fingerprint and IP address
    // 5 requests per hour per fingerprint + 30 requests per hour per IP
    const rateLimit = await checkCombinedRateLimit(
      request,
      rateLimiters.processAnon,
      fingerprint,
      rateLimiters.ipProcess
    )

    if (!rateLimit.success) {
      const limitType = rateLimit.limitedBy === "ip" ? "IP address" : "browser"
      return NextResponse.json(
        { 
          message: `Too many requests from this ${limitType}. Please sign up for unlimited processing!`,
          resetAt: new Date(rateLimit.reset * 1000).toISOString(),
          requiresSignup: true,
          limitedBy: rateLimit.limitedBy
        },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimit),
        }
      )
    }

    const supabase = getServiceClient()

    let { data: anonUser, error } = await supabase
      .from("anon_users")
      .select("*")
      .eq("fingerprint", fingerprint)
      .maybeSingle()

    if (error) {
      console.error("Error fetching anon user:", error)
      return NextResponse.json({ message: "Database error" }, { status: 500 })
    }

    if (!anonUser) {
      const { data: newUser, error: createError } = await supabase
        .from("anon_users")
        .insert({ fingerprint, credits: 3, last_credit_reset: new Date().toISOString(), updated_at: new Date().toISOString() })
        .select()
        .single()

      if (createError) {
        console.error("Failed to create anon user:", createError)
        return NextResponse.json({ message: "Failed to create user" }, { status: 500 })
      }
      anonUser = newUser
    }

    if (shouldResetCredits(anonUser.last_credit_reset)) {
      const { data: refreshedUser, error: resetError } = await supabase
        .from("anon_users")
        .update({ credits: 3, last_credit_reset: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq("id", anonUser.id)
        .select()
        .single()

      if (resetError) {
        console.error("Failed to reset anon user credits:", resetError)
        return NextResponse.json({ message: "Failed to refresh credits" }, { status: 500 })
      }
      anonUser = refreshedUser
    }

    // Atomically check and deduct credits to prevent race conditions
    const { data: creditResult, error: creditError } = await supabase
      .rpc('deduct_anon_credit', {
        p_anon_user_id: anonUser.id,
        p_amount: 1
      })
      .single()

    if (creditError) {
      console.error("Credit deduction error:", creditError)
      return NextResponse.json({ message: "Failed to process credits" }, { status: 500 })
    }

    if (!creditResult || !(creditResult as any).success) {
      await releaseIdempotentRequest(idempotencyKey)
      return NextResponse.json(
        {
          message: "No credits remaining. Sign up for more!",
          credits: (creditResult as any)?.credits || 0,
          requiresSignup: true,
        },
        { status: 402 },
      )
    }

    let apiKey: string | undefined
    let apiUrl: string
    let jobType: "bg_removal" | "upscale"

    if (type === "bg_removal") {
      apiKey = process.env.ICONS8_BG_REMOVER_API_KEY
      apiUrl = `${BG_REMOVER_API}/process_image?token=${apiKey}`
      jobType = "bg_removal"
    } else if (type === "upscale") {
      apiKey = process.env.ICONS8_UPSCALER_API_KEY
      apiUrl = `${UPSCALER_API}/enhance_image?token=${apiKey}`
      jobType = "upscale"
    } else {
      return NextResponse.json({ message: "Invalid type" }, { status: 400 })
    }

    if (!apiKey) {
      return NextResponse.json({ message: "API key not configured" }, { status: 500 })
    }

    // Prepare form data for Icons8 API
    const apiFormData = new FormData()
    apiFormData.append("image", image)

    // Call Icons8 API with timeout and retry
    const apiResponse = await fetchWithTimeout(apiUrl, {
      method: "POST",
      body: apiFormData,
      ...fetchPresets.long, // 60s timeout for image processing
      onRetry: (attempt, error) => {
        console.warn(`[Icons8 Public] Retry ${attempt} for ${jobType}:`, error.message)
      },
    })

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text()
      console.error("Icons8 API error:", errorText)
      return NextResponse.json({ message: "Image processing failed" }, { status: 500 })
    }

    const result = await apiResponse.json()

    // Create processing job record
    const { data: job, error: jobError } = await supabase
      .from("anon_processing_jobs")
      .insert({
        anon_user_id: anonUser.id,
        job_type: jobType,
        external_job_id: result.id,
        source_url: result.source?.url || "",
        status: "processing",
      })
      .select()
      .single()

    if (jobError) {
      console.error("Failed to create job:", jobError)
      return NextResponse.json({ message: "Failed to create processing job" }, { status: 500 })
    }

    return NextResponse.json({
      job_id: result.id,
      status: result.statusName,
      internal_job_id: job.id,
      credits_remaining: anonUser.credits - 1,
    })
  } catch (error) {
    console.error("Processing error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
