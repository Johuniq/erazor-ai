import { useAuthStore } from "@/lib/store/auth-store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

/**
 * Hook to protect routes that require authentication
 * Redirects to login if user is not authenticated
 * 
 * @param redirectTo - Where to redirect if not authenticated (default: /login)
 * @returns User object and loading state
 */
export function useRequireAuth(redirectTo = "/login") {
  const { user, isAuthenticated, isLoading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, router, redirectTo])

  return { user, isLoading, isAuthenticated }
}

/**
 * Hook to redirect authenticated users away from auth pages
 * (e.g., redirect from /login to /dashboard if already logged in)
 * 
 * @param redirectTo - Where to redirect if authenticated (default: /dashboard)
 */
export function useRedirectIfAuthenticated(redirectTo = "/dashboard") {
  const { isAuthenticated, isLoading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, router, redirectTo])

  return { isLoading, isAuthenticated }
}
