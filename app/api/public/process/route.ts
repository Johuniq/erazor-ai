import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const BG_REMOVER_API = "https://api-bgremover.icons8.com/api/v1"
const UPSCALER_API = "https://api-upscaler.icons8.com/api/v1"

// Use service role for anonymous operations
function getServiceClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File
    const type = formData.get("type") as string
    const fingerprint = formData.get("fingerprint") as string

    if (!image) {
      return NextResponse.json({ message: "No image provided" }, { status: 400 })
    }

    if (!fingerprint) {
      return NextResponse.json({ message: "Fingerprint required" }, { status: 400 })
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

    // Check credits
    if (anonUser.credits < 1) {
      return NextResponse.json(
        {
          message: "No credits remaining. Sign up for more!",
          credits: 0,
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

    // Deduct credits
    await supabase
      .from("anon_users")
      .update({ credits: anonUser.credits - 1, updated_at: new Date().toISOString() })
      .eq("id", anonUser.id)

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
