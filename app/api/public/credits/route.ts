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

    let { data: anonUser, error } = await supabase
      .from("anon_users")
      .select("credits")
      .eq("fingerprint", fingerprint)
      .maybeSingle()

    if (error) {
      console.error("Error fetching anon user:", error)
      return NextResponse.json({ message: "Database error" }, { status: 500 })
    }

    if (!anonUser) {
      // Create new user with 3 credits
      const { data: newUser, error: insertError } = await supabase
        .from("anon_users")
        .insert({ fingerprint, credits: 3 })
        .select("credits")
        .single()

      if (insertError) {
        console.error("Error creating anon user:", insertError)
        return NextResponse.json({ message: "Database error" }, { status: 500 })
      }

      anonUser = newUser
    }

    return NextResponse.json({ credits: anonUser?.credits ?? 3 })
  } catch (error) {
    console.error("Credits check error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
