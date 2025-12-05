import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function getServiceClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function POST(request: NextRequest) {
  try {
    const { fingerprint } = await request.json()

    if (!fingerprint) {
      return NextResponse.json({ message: "Fingerprint required" }, { status: 400 })
    }

    const supabase = getServiceClient()

    // Get anon user
    const { data: anonUser } = await supabase.from("anon_users").select("id").eq("fingerprint", fingerprint).single()

    if (!anonUser) {
      return NextResponse.json({ jobs: [] })
    }

    // Get history
    const { data: jobs } = await supabase
      .from("anon_processing_jobs")
      .select("*")
      .eq("anon_user_id", anonUser.id)
      .order("created_at", { ascending: false })
      .limit(10)

    return NextResponse.json({ jobs: jobs || [] })
  } catch (error) {
    console.error("History error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
