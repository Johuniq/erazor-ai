import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/dashboard/overview"

  if (code) {
    const supabase = await createClient()
    
    // Exchange code for session
    const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (sessionError) {
      console.error("Auth callback error:", sessionError)
      return NextResponse.redirect(new URL("/login?error=auth_failed", requestUrl.origin))
    }

    // Check if user has a profile
    if (sessionData?.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", sessionData.user.id)
        .single()

      // If no profile exists, create one
      if (!profile) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: sessionData.user.id,
            email: sessionData.user.email,
            full_name: sessionData.user.user_metadata?.full_name || 
                       sessionData.user.user_metadata?.name || 
                       null,
            avatar_url: sessionData.user.user_metadata?.avatar_url || 
                       sessionData.user.user_metadata?.picture || 
                       null,
            credits: 10,
            plan: "free",
          })

        if (profileError) {
          console.error("Error creating profile:", profileError)
        }
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(next, requestUrl.origin))
}
