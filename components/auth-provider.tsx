"use client"

import { useAuthStore } from "@/lib/store/auth-store"
import { useUserStore } from "@/lib/store/user-store"
import { createClient } from "@/lib/supabase/client"
import type { AuthChangeEvent, Session } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

/**
 * Auth Provider Component
 * Initializes auth state on app load and handles auth state changes
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { fetchUser, setUser } = useAuthStore()
  const { fetchProfile, reset: resetUserStore } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    // Fetch initial auth state
    fetchUser()

    // Set up auth state change listener
    const supabase = createClient()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user)
        await fetchProfile()
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        resetUserStore()
        router.push("/")
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        setUser(session.user)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchUser, setUser, fetchProfile, resetUserStore, router])

  return <>{children}</>
}
