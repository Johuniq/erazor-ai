import { fingerprintSchema } from "@/lib/validations/api"
import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

function getServiceClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function POST(request: NextRequest) {
  try {
    const { fingerprint } = await request.json()

    if (!fingerprint) {
      return NextResponse.json({ message: "Fingerprint required" }, { status: 400 })
    }

    // Validate fingerprint format
    const validation = fingerprintSchema.safeParse(fingerprint)
    if (!validation.success) {
      return NextResponse.json({ 
        message: "Invalid fingerprint format" 
      }, { status: 400 })
    }

    const supabase = getServiceClient()

    // First, try to get existing user
    const { data: existingUser, error: fetchError } = await supabase
      .from("anon_users")
      .select("credits")
      .eq("fingerprint", fingerprint)
      .maybeSingle()

    if (fetchError) {
      console.error("Error fetching anon user:", fetchError)
      return NextResponse.json({ message: "Database error" }, { status: 500 })
    }

    // If user exists, return their current credits
    if (existingUser) {
      return NextResponse.json({ credits: existingUser.credits ?? 0 })
    }

    // User doesn't exist - create with INSERT and handle conflict
    const { data: newUser, error: insertError } = await supabase
      .from("anon_users")
      .insert({ fingerprint, credits: 3 })
      .select("credits")
      .single()

    // If conflict (race condition), fetch the existing user created by another request
    if (insertError?.code === '23505') { // Unique violation
      const { data: raceUser } = await supabase
        .from("anon_users")
        .select("credits")
        .eq("fingerprint", fingerprint)
        .single()
      
      return NextResponse.json({ credits: raceUser?.credits ?? 3 })
    }

    if (insertError) {
      console.error("Error creating anon user:", insertError)
      return NextResponse.json({ message: "Database error" }, { status: 500 })
    }

    // Return credits from newly created user
    return NextResponse.json({ credits: newUser?.credits ?? 3 })
  } catch (error) {
    console.error("Credits check error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
