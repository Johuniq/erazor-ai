import { createClient } from "@/lib/supabase/server"
import { Polar } from "@polar-sh/sdk"
import { type NextRequest, NextResponse } from "next/server"

const BG_REMOVER_API = "https://api-bgremover.icons8.com/api/v1"
const UPSCALER_API = "https://api-upscaler.icons8.com/api/v1"

// Initialize Polar client for event ingestion
const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: process.env.NODE_ENV === "production" ? "production" : "production",
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check user credits
    const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single()

    if (!profile || profile.credits < 1) {
      return NextResponse.json({ message: "Insufficient credits. Please upgrade your plan." }, { status: 402 })
    }

    const formData = await request.formData()
    const image = formData.get("image") as File
    const type = formData.get("type") as string

    if (!image) {
      return NextResponse.json({ message: "No image provided" }, { status: 400 })
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
      return NextResponse.json({ message: "API key not configured for this service" }, { status: 500 })
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
      .from("processing_jobs")
      .insert({
        user_id: user.id,
        job_type: jobType,
        external_job_id: result.id,
        source_url: result.source?.url || "",
        status: "processing",
        credits_used: 1,
      })
      .select()
      .single()

    if (jobError) {
      console.error("Failed to create job:", jobError)
      return NextResponse.json({ message: "Failed to create processing job" }, { status: 500 })
    }

    // Deduct credits
    await supabase
      .from("profiles")
      .update({ credits: profile.credits - 1 })
      .eq("id", user.id)

    // Log credit transaction
    await supabase.from("credit_transactions").insert({
      user_id: user.id,
      amount: -1,
      type: "usage",
      description: jobType === "bg_removal" ? "Background removal" : "Image upscaling",
      reference_id: job.id,
    })

    // Ingest event to Polar to deduct credits from meter
    try {
      await polar.events.ingest({
        events: [
          {
            name: "credit_usage",
            externalCustomerId: user.id,
            metadata: {
              job_type: jobType,
              job_id: job.id,
              units: 1,
            },
          },
        ],
      })
      console.log(`Polar event ingested for user ${user.id}: 1 credit used for ${jobType}`)
    } catch (polarError) {
      // Log but don't fail the request if Polar event ingestion fails
      console.error("Failed to ingest Polar event:", polarError)
    }

    return NextResponse.json({
      job_id: result.id,
      status: result.statusName,
      internal_job_id: job.id,
    })
  } catch (error) {
    console.error("Processing error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
