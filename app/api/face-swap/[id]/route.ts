import { verifyOrigin } from "@/lib/csrf-protection"
import { fetchWithTimeout } from "@/lib/fetch-with-timeout"
import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

const FACE_SWAPPER_API = "https://api-faceswapper-origin.icons8.com/api/v1"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // CSRF protection
    const { valid, origin, reason } = verifyOrigin(request)
    if (!valid) {
      console.warn(`[CSRF] Blocked face-swap status request - ${reason || "Unknown"} (Origin: ${origin || "none"})`)
      return NextResponse.json({ message: "Forbidden - Invalid origin" }, { status: 403 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id: jobId } = await params

    if (!jobId) {
      return NextResponse.json({ message: "Job ID is required" }, { status: 400 })
    }

    const apiKey = process.env.ICONS8_FACE_SWAPPER_API_KEY
    if (!apiKey) {
      console.error("Face Swapper API key not configured")
      return NextResponse.json({ message: "Service temporarily unavailable" }, { status: 503 })
    }

    // Check job status from API
    const response = await fetchWithTimeout(`${FACE_SWAPPER_API}/process_image/${jobId}?token=${apiKey}`, {
      method: "GET",
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ message: "Job not found" }, { status: 404 })
      }
      const errorText = await response.text()
      console.error("Status check error:", errorText)
      return NextResponse.json({ message: "Failed to check status" }, { status: 500 })
    }

    const data = await response.json()
    
    // Update database with status
    if (data.status === 2 && data.processed?.url) {
      // Status 2 means "ready"
      await supabase
        .from("processing_history")
        .update({
          status: "completed",
          result_url: data.processed.url,
          completed_at: new Date().toISOString(),
        })
        .eq("job_id", jobId)
        .eq("user_id", user.id)
    } else if (data.status === 3) {
      // Status 3 means "failed"
      await supabase
        .from("processing_history")
        .update({
          status: "failed",
          error: "Face swap processing failed",
        })
        .eq("job_id", jobId)
        .eq("user_id", user.id)
    }

    return NextResponse.json({
      status: data.statusName || "processing",
      processed: data.processed || null,
      jobId: data.id,
    })
  } catch (error) {
    console.error("Status check error:", error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Status check failed" },
      { status: 500 }
    )
  }
}
