import { verifyOrigin } from "@/lib/csrf-protection"
import { fetchWithTimeout } from "@/lib/fetch-with-timeout"
import { checkCombinedRateLimit, getRateLimitHeaders, rateLimiters } from "@/lib/redis-rate-limiter"
import { createClient } from "@/lib/supabase/server"
import { sanitizeFilename } from "@/lib/validations/api"
import { v2 as cloudinary } from 'cloudinary'
import { type NextRequest, NextResponse } from "next/server"

const FACE_SWAPPER_API = "https://api-faceswapper.icons8.com/api/v1"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

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

    // Validate files BEFORE deducting credits
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

    // Check Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("Cloudinary credentials not configured")
      return NextResponse.json({ message: "Image hosting service not configured" }, { status: 503 })
    }

    // Upload images to Cloudinary to get public URLs
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(7)
    
    let targetUrl: string
    let sourceUrl: string
    let targetPublicId: string = ''
    let sourcePublicId: string = ''

    try {
      // Upload target image to Cloudinary
      const targetBuffer = await targetImage.arrayBuffer()
      const targetBase64 = Buffer.from(targetBuffer).toString('base64')
      const targetDataUrl = `data:${targetImage.type};base64,${targetBase64}`
      
      targetPublicId = `face-swap/${user.id}/${timestamp}-${randomId}-target`
      const targetUploadResult = await cloudinary.uploader.upload(targetDataUrl, {
        public_id: targetPublicId,
        folder: 'face-swap',
        resource_type: 'image',
        overwrite: false,
        invalidate: true,
      })
      targetUrl = targetUploadResult.secure_url

      // Upload source image to Cloudinary
      const sourceBuffer = await sourceImage.arrayBuffer()
      const sourceBase64 = Buffer.from(sourceBuffer).toString('base64')
      const sourceDataUrl = `data:${sourceImage.type};base64,${sourceBase64}`
      
      sourcePublicId = `face-swap/${user.id}/${timestamp}-${randomId}-source`
      const sourceUploadResult = await cloudinary.uploader.upload(sourceDataUrl, {
        public_id: sourcePublicId,
        folder: 'face-swap',
        resource_type: 'image',
        overwrite: false,
        invalidate: true,
      })
      sourceUrl = sourceUploadResult.secure_url

      console.log("Target URL:", targetUrl)
      console.log("Source URL:", sourceUrl)
      
      // Test if URLs are accessible
      console.log("Testing Cloudinary URLs accessibility...")
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError)
      // Clean up any uploaded images
      if (targetPublicId) {
        await cloudinary.uploader.destroy(targetPublicId).catch(console.error)
      }
      if (sourcePublicId) {
        await cloudinary.uploader.destroy(sourcePublicId).catch(console.error)
      }
      return NextResponse.json({ message: "Failed to upload images" }, { status: 500 })
    }

    // Get bounding boxes first - using the correct API format
    console.log("Requesting face detection from Icons8 API...")
    console.log("Payload:", JSON.stringify({ urls: [targetUrl, sourceUrl] }, null, 2))
    
    const bboxResponse = await fetchWithTimeout(`${FACE_SWAPPER_API}/get_bbox?token=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        urls: [targetUrl, sourceUrl]
      }),
    })

    if (!bboxResponse.ok) {
      const errorText = await bboxResponse.text()
      console.error("Face detection error:", errorText)
      console.error("Response status:", bboxResponse.status)
      console.error("URLs sent:", { targetUrl, sourceUrl })
      
      // Clean up uploaded images from Cloudinary
      await cloudinary.uploader.destroy(targetPublicId).catch(console.error)
      await cloudinary.uploader.destroy(sourcePublicId).catch(console.error)
      
      return NextResponse.json({ 
        message: "Could not detect faces in images. Please ensure both images contain clearly visible, front-facing faces with good lighting." 
      }, { status: 400 })
    }

    const bboxData = await bboxResponse.json()
    console.log("Bbox response:", JSON.stringify(bboxData, null, 2))
    console.log("Target faces found:", bboxData[0]?.faces?.length || 0)
    console.log("Source faces found:", bboxData[1]?.faces?.length || 0)
    
    if (!bboxData || !Array.isArray(bboxData) || bboxData.length < 2) {
      // Clean up uploaded images from Cloudinary
      await cloudinary.uploader.destroy(targetPublicId).catch(console.error)
      await cloudinary.uploader.destroy(sourcePublicId).catch(console.error)
      
      return NextResponse.json({ 
        message: "Could not detect faces in one or both images. Make sure faces are clearly visible." 
      }, { status: 400 })
    }

    const targetFaces = bboxData[0]?.faces || []
    const sourceFaces = bboxData[1]?.faces || []

    if (targetFaces.length === 0 || sourceFaces.length === 0) {
      // Clean up uploaded images from Cloudinary
      await cloudinary.uploader.destroy(targetPublicId).catch(console.error)
      await cloudinary.uploader.destroy(sourcePublicId).catch(console.error)
      
      const missingFace = targetFaces.length === 0 ? "target image" : "source image"
      return NextResponse.json({ 
        message: `No face detected in ${missingFace}. Please use images with clearly visible, front-facing faces.` 
      }, { status: 400 })
    }

    // Faces detected successfully - NOW deduct credits
    const { data: creditResult, error: creditError } = await supabase
      .rpc('deduct_credit', {
        p_user_id: user.id,
        p_amount: 2
      })
      .single()

    if (creditError) {
      console.error("Credit deduction error:", creditError)
      // Clean up images
      await cloudinary.uploader.destroy(targetPublicId).catch(console.error)
      await cloudinary.uploader.destroy(sourcePublicId).catch(console.error)
      return NextResponse.json({ message: "Failed to process credits" }, { status: 500 })
    }

    if (!creditResult || !(creditResult as any).success) {
      // Clean up images
      await cloudinary.uploader.destroy(targetPublicId).catch(console.error)
      await cloudinary.uploader.destroy(sourcePublicId).catch(console.error)
      return NextResponse.json({ 
        message: "Insufficient credits. Face swap requires 2 credits.",
        credits: (creditResult as any)?.credits || 0
      }, { status: 402 })
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
        target_url: targetUrl,
        face_tasks: [
          {
            source_url: sourceUrl,
            source_landmarks: sourceLandmarks,
            target_landmarks: targetLandmarks,
          }
        ]
      }),
    })

    if (!swapResponse.ok) {
      const errorText = await swapResponse.text()
      console.error("Face swap error:", errorText)
      console.error("Response status:", swapResponse.status)
      
      // Clean up uploaded images from Cloudinary
      await cloudinary.uploader.destroy(targetPublicId).catch(console.error)
      await cloudinary.uploader.destroy(sourcePublicId).catch(console.error)
      
      return NextResponse.json({ 
        message: "Face swap processing failed. Please try again with different images." 
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
