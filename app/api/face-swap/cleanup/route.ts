import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Manual job cleanup - mark old stuck jobs as failed
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Mark face swap jobs older than 10 minutes and still processing as failed
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()

    const { data, error } = await supabase
      .from("processing_jobs")
      .update({
        status: "failed",
        error: "Job timed out or encountered an error. Please try again.",
      })
      .eq("user_id", user.id)
      .eq("job_type", "face_swap")
      .eq("status", "processing")
      .lt("created_at", tenMinutesAgo)
      .select()

    if (error) {
      console.error("Failed to cleanup jobs:", error)
      return NextResponse.json({ message: "Failed to cleanup jobs" }, { status: 500 })
    }

    return NextResponse.json({
      message: `Cleaned up ${data?.length || 0} stuck jobs`,
      updated: data?.length || 0,
    })
  } catch (error) {
    console.error("Cleanup error:", error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Cleanup failed" },
      { status: 500 }
    )
  }
}
