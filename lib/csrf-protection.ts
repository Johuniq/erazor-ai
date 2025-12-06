import { NextRequest, NextResponse } from "next/server";

/**
 * Verify that the request comes from an allowed origin
 * Helps prevent CSRF attacks on state-changing operations
 */
export function verifyOrigin(request: NextRequest): { valid: boolean; origin: string | null } {
  const origin = request.headers.get("origin")
  const referer = request.headers.get("referer")
  
  // Allow requests from allowed origins
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL,
    "https://www.erazor.app",
    "https://erazor.app",
    "http://localhost:3000", // Development
  ].filter(Boolean)

  // Check origin header
  if (origin) {
    const isAllowed = allowedOrigins.some(allowed => origin.startsWith(allowed!))
    return { valid: isAllowed, origin }
  }

  // Fallback to referer if origin is not present
  if (referer) {
    const isAllowed = allowedOrigins.some(allowed => referer.startsWith(allowed!))
    return { valid: isAllowed, origin: referer }
  }

  // No origin or referer - likely direct API call or postman
  return { valid: false, origin: null }
}

/**
 * Middleware helper to add CSRF protection to API routes
 */
export function withCSRFProtection(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    // Skip GET and HEAD requests (read-only)
    if (request.method === "GET" || request.method === "HEAD") {
      return handler(request)
    }

    // Verify origin for state-changing requests
    const { valid, origin } = verifyOrigin(request)
    
    if (!valid) {
      console.warn(`[CSRF] Blocked request from origin: ${origin || "unknown"}`)
      return NextResponse.json(
        { message: "Forbidden - Invalid origin" },
        { status: 403 }
      )
    }

    return handler(request)
  }
}
