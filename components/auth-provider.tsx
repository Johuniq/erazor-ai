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
  const { fetchUser, setUser, reset: resetAuthStore } = useAuthStore()
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
      console.log('Auth state change:', event, session?.user?.email)
      
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user)
        await fetchProfile()
      } else if (event === "SIGNED_OUT") {
        console.log('Handling SIGNED_OUT event')
        // Reset all stores
        setUser(null)
        resetAuthStore()
        resetUserStore()
        
        // Hard redirect to home and reload
        console.log('Redirecting to home...')
        window.location.href = "/"
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        setUser(session.user)
      } else if (event === "USER_UPDATED" && session?.user) {
        setUser(session.user)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchUser, setUser, fetchProfile, resetAuthStore, resetUserStore, router])

  return <>{children}</>
}
