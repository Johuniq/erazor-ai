import { verifyOrigin } from "@/lib/csrf-protection"
import { fetchWithTimeout } from "@/lib/fetch-with-timeout"
import { checkCombinedRateLimit, getRateLimitHeaders, rateLimiters } from "@/lib/redis-rate-limiter"
import { createClient } from "@/lib/supabase/server"
import { sanitizeFilename } from "@/lib/validations/api"
import { type NextRequest, NextResponse } from "next/server"

const FACE_SWAPPER_API = "https://api-faceswapper-origin.icons8.com/api/v1"

export async function POST(request: NextRequest) {
  try {
    // CSRF protection
    const { valid, origin, reason } = verifyOrigin(request)
    if (!valid) {
      console.warn(`[CSRF] Blocked face-swap request - ${reason || "Unknown"} (Origin: ${origin || "none"})`)
      return NextResponse.json({ message: "Forbidden - Invalid origin" }, { status: 403 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Rate limiting
    const rateLimit = await checkCombinedRateLimit(
      request,
      rateLimiters.processAuth,
      user.id,
      rateLimiters.ipProcess
    )

    if (!rateLimit.success) {
      const limitType = rateLimit.limitedBy === "ip" ? "IP address" : "account"
      return NextResponse.json(
        { 
          message: `Too many requests from this ${limitType}. Please try again later.`,
          resetAt: new Date(rateLimit.reset * 1000).toISOString(),
          limitedBy: rateLimit.limitedBy
        },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimit),
        }
      )
    }

    const formData = await request.formData()
    const targetImage = formData.get("target_image") as File
    const sourceImage = formData.get("source_image") as File

    if (!targetImage || !sourceImage) {
      return NextResponse.json({ message: "Both target and source images are required" }, { status: 400 })
    }

    // Atomically check and deduct credits (2 credits for face swap)
    const { data: creditResult, error: creditError } = await supabase
      .rpc('deduct_credit', {
        p_user_id: user.id,
        p_amount: 2
      })
      .single()

    if (creditError) {
      console.error("Credit deduction error:", creditError)
      return NextResponse.json({ message: "Failed to process credits" }, { status: 500 })
    }

    if (!creditResult || !(creditResult as any).success) {
      return NextResponse.json({ 
        message: "Insufficient credits. Face swap requires 2 credits.",
        credits: (creditResult as any)?.credits || 0
      }, { status: 402 })
    }

    // Validate files
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB max
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    
    if (targetImage.size > MAX_FILE_SIZE || sourceImage.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        message: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` 
      }, { status: 413 })
    }

    if (!allowedTypes.includes(targetImage.type) || !allowedTypes.includes(sourceImage.type)) {
      return NextResponse.json({ 
        message: "Invalid file type. Only JPEG, PNG, and WebP are allowed" 
      }, { status: 400 })
    }

    const apiKey = process.env.ICONS8_FACE_SWAPPER_API_KEY
    if (!apiKey) {
      console.error("Face Swapper API key not configured")
      return NextResponse.json({ message: "Service temporarily unavailable" }, { status: 503 })
    }

    // Upload both images to get URLs
    const targetFormData = new FormData()
    targetFormData.append("image", targetImage)
    
    const sourceFormData = new FormData()
    sourceFormData.append("image", sourceImage)

    // For simplicity, we'll upload to our CDN or use the API's upload endpoint
    // First, let's get bounding boxes to detect faces
    const targetBuffer = await targetImage.arrayBuffer()
    const sourceBuffer = await sourceImage.arrayBuffer()
    
    // Convert to base64 for API
    const targetBase64 = Buffer.from(targetBuffer).toString('base64')
    const sourceBase64 = Buffer.from(sourceBuffer).toString('base64')
    
    // Create temporary URLs (in production, upload to your CDN)
    const targetDataUrl = `data:${targetImage.type};base64,${targetBase64}`
    const sourceDataUrl = `data:${sourceImage.type};base64,${sourceBase64}`

    // Get bounding boxes first
    const bboxResponse = await fetchWithTimeout(`${FACE_SWAPPER_API}/get_bbox?token=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        urls: [targetDataUrl, sourceDataUrl]
      }),
    })

    if (!bboxResponse.ok) {
      const errorText = await bboxResponse.text()
      console.error("Face detection error:", errorText)
      return NextResponse.json({ 
        message: "Could not detect faces in images. Please ensure both images contain visible faces." 
      }, { status: 400 })
    }

    const bboxData = await bboxResponse.json()
    
    if (!bboxData || bboxData.length < 2) {
      return NextResponse.json({ 
        message: "Could not detect faces in one or both images." 
      }, { status: 400 })
    }

    const targetFaces = bboxData[0]?.faces || []
    const sourceFaces = bboxData[1]?.faces || []

    if (targetFaces.length === 0 || sourceFaces.length === 0) {
      return NextResponse.json({ 
        message: "No faces detected. Please use images with clearly visible faces." 
      }, { status: 400 })
    }

    // Use the first detected face from each image
    const targetLandmarks = targetFaces[0].landmarks
    const sourceLandmarks = sourceFaces[0].landmarks

    // Initiate face swap
    const swapResponse = await fetchWithTimeout(`${FACE_SWAPPER_API}/process_image?token=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target_url: targetDataUrl,
        face_tasks: [
          {
            source_url: sourceDataUrl,
            source_landmarks: sourceLandmarks,
            target_landmarks: targetLandmarks,
          }
        ]
      }),
    })

    if (!swapResponse.ok) {
      const errorText = await swapResponse.text()
      console.error("Face swap error:", errorText)
      return NextResponse.json({ 
        message: "Face swap processing failed. Please try again." 
      }, { status: 500 })
    }

    const swapData = await swapResponse.json()
    const jobId = swapData.id

    // Save job to database
    await supabase.from("processing_history").insert({
      user_id: user.id,
      job_id: jobId,
      job_type: "face_swap",
      status: "processing",
      original_filename: sanitizeFilename(targetImage.name),
      credits_used: 2,
    })

    // Update user credits in user store
    const updatedCredits = (creditResult as any).credits
    
    return NextResponse.json(
      {
        jobId,
        status: swapData.statusName || "processing",
        message: "Face swap initiated successfully",
        credits: updatedCredits,
      },
      { 
        status: 200,
        headers: getRateLimitHeaders(rateLimit),
      }
    )
  } catch (error) {
    console.error("Face swap error:", error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Processing failed" },
      { status: 500 }
    )
  }
}
