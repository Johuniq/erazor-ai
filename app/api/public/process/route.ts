import { verifyOrigin } from "@/lib/csrf-protection"
import { getRateLimiter, RATE_LIMITS } from "@/lib/rate-limiter"
import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const BG_REMOVER_API = "https://api-bgremover.icons8.com/api/v1"
const UPSCALER_API = "https://api-upscaler.icons8.com/api/v1"

// Use service role for anonymous operations
function getServiceClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function POST(request: NextRequest) {
  try {
    // CSRF protection - verify origin
    const { valid, origin } = verifyOrigin(request)
    if (!valid) {
      console.warn(`[CSRF] Blocked public process request from origin: ${origin || "unknown"}`)
      return NextResponse.json({ message: "Forbidden - Invalid origin" }, { status: 403 })
    }

    const formData = await request.formData()
    const image = formData.get("image") as File
    const type = formData.get("type") as string
    const fingerprint = formData.get("fingerprint") as string

    if (!image) {
      return NextResponse.json({ message: "No image provided" }, { status: 400 })
    }

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

    if (!fingerprint) {
      return NextResponse.json({ message: "Fingerprint required" }, { status: 400 })
    }

    // Rate limiting - 5 requests per hour per fingerprint
    const rateLimiter = getRateLimiter()
    const rateLimit = rateLimiter.check(
      fingerprint,
      RATE_LIMITS.PROCESS_ANON.maxRequests,
      RATE_LIMITS.PROCESS_ANON.windowMs
    )

    if (!rateLimit.success) {
      return NextResponse.json(
        { 
          message: "Too many requests. Please sign up for unlimited processing!",
          resetAt: new Date(rateLimit.resetAt).toISOString(),
          requiresSignup: true
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(RATE_LIMITS.PROCESS_ANON.maxRequests),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
            'X-RateLimit-Reset': String(rateLimit.resetAt),
          }
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
        .insert({ fingerprint, credits: 3 })
        .select()
        .single()

      if (createError) {
        console.error("Failed to create anon user:", createError)
        return NextResponse.json({ message: "Failed to create user" }, { status: 500 })
      }
      anonUser = newUser
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

    // Call Icons8 API
    const apiResponse = await fetch(apiUrl, {
      method: "POST",
      body: apiFormData,
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
