import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const BG_REMOVER_API = "https://api-bgremover.icons8.com/api/v1"
const UPSCALER_API = "https://api-upscaler.icons8.com/api/v1"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    let apiKey: string | undefined
    let apiUrl: string

    if (type === "bg_removal") {
      apiKey = process.env.ICONS8_BG_REMOVER_API_KEY
      apiUrl = `${BG_REMOVER_API}/process_image/${id}?token=${apiKey}`
    } else if (type === "upscale") {
      apiKey = process.env.ICONS8_UPSCALER_API_KEY
      apiUrl = `${UPSCALER_API}/enhance_image/${id}?token=${apiKey}`
    } else {
      return NextResponse.json({ message: "Invalid type" }, { status: 400 })
    }

    if (!apiKey) {
      return NextResponse.json({ message: "API key not configured for this service" }, { status: 500 })
    }

    const apiResponse = await fetch(apiUrl)

    if (!apiResponse.ok) {
      return NextResponse.json({ message: "Failed to get status" }, { status: 500 })
    }

    const result = await apiResponse.json()

    // Map Icons8 status to our status
    let status: "pending" | "processing" | "completed" | "failed"
    let resultUrl: string | null = null

    if (result.statusName === "ready" || result.statusName === "maxEnhanced") {
      status = "completed"
      resultUrl = type === "bg_removal" ? result.processed?.url : result.enhanced?.url
    } else if (result.statusName === "error") {
      status = "failed"
    } else if (result.statusName === "processing") {
      status = "processing"
    } else {
      status = "pending"
    }

    // Update job in database if completed or failed
    if (status === "completed" || status === "failed") {
      await supabase
        .from("processing_jobs")
        .update({
          status,
          result_url: resultUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("external_job_id", id)
        .eq("user_id", user.id)
    }

    return NextResponse.json({
      status,
      result_url: resultUrl,
      external_status: result.statusName,
    })
  } catch (error) {
    console.error("Status check error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
