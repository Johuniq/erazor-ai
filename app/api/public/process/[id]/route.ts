import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const BG_REMOVER_API = "https://api-bgremover.icons8.com/api/v1"
const UPSCALER_API = "https://api-upscaler.icons8.com/api/v1"

function getServiceClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
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
      return NextResponse.json({ message: "API key not configured" }, { status: 500 })
    }

    const apiResponse = await fetch(apiUrl)

    if (!apiResponse.ok) {
      return NextResponse.json({ message: "Failed to get status" }, { status: 500 })
    }

    const result = await apiResponse.json()

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
      const supabase = getServiceClient()
      await supabase
        .from("anon_processing_jobs")
        .update({
          status,
          result_url: resultUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("external_job_id", id)
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
