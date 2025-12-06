import { NextRequest, NextResponse } from "next/server"

/**
 * CORS Configuration with strict validation
 */
interface CORSConfig {
  allowedOrigins: string[]
  allowedDomainPatterns: RegExp[]
  allowSubdomains: boolean
  allowedMethods: string[]
  maxAge: number
}

/**
 * Production-safe CORS configuration
 */
const corsConfig: CORSConfig = {
  // Exact origins that are allowed
  allowedOrigins: [
    process.env.NEXT_PUBLIC_SITE_URL,
    "https://www.erazor.app",
    "https://erazor.app",
    ...(process.env.NODE_ENV === "development" 
      ? ["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"]
      : []
    ),
  ].filter(Boolean) as string[],

  // Domain patterns for subdomain validation
  allowedDomainPatterns: [
    /^https:\/\/(www\.)?erazor\.app$/,
    /^https:\/\/[a-z0-9-]+\.erazor\.app$/, // Subdomains like api.erazor.app, staging.erazor.app
    ...(process.env.NODE_ENV === "development" 
      ? [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/]
      : []
    ),
  ],

  allowSubdomains: true,
  allowedMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  maxAge: 86400, // 24 hours
}

/**
 * Validate if origin matches allowed patterns
 */
function isOriginAllowed(origin: string): boolean {
  // Check exact matches first (fastest)
  if (corsConfig.allowedOrigins.includes(origin)) {
    return true
  }

  // Check against regex patterns for subdomain validation
  if (corsConfig.allowSubdomains) {
    return corsConfig.allowedDomainPatterns.some(pattern => pattern.test(origin))
  }

  return false
}

/**
 * Extract domain from origin for logging
 */
function extractDomain(origin: string): string {
  try {
    const url = new URL(origin)
    return url.hostname
  } catch {
    return "invalid-url"
  }
}

/**
 * Verify that the request comes from an allowed origin
 * Enhanced with strict whitelist and subdomain validation
 */
export function verifyOrigin(request: NextRequest): { 
  valid: boolean
  origin: string | null
  reason?: string
} {
  const origin = request.headers.get("origin")
  const referer = request.headers.get("referer")
  
  // Check origin header (most reliable)
  if (origin) {
    const isAllowed = isOriginAllowed(origin)
    
    if (!isAllowed) {
      const domain = extractDomain(origin)
      return { 
        valid: false, 
        origin,
        reason: `Origin '${domain}' not in whitelist`
      }
    }
    
    return { valid: true, origin }
  }

  // Fallback to referer if origin is not present
  if (referer) {
    try {
      const refererUrl = new URL(referer)
      const refererOrigin = `${refererUrl.protocol}//${refererUrl.host}`
      const isAllowed = isOriginAllowed(refererOrigin)
      
      if (!isAllowed) {
        const domain = extractDomain(refererOrigin)
        return { 
          valid: false, 
          origin: refererOrigin,
          reason: `Referer domain '${domain}' not in whitelist`
        }
      }
      
      return { valid: true, origin: refererOrigin }
    } catch {
      return { 
        valid: false, 
        origin: referer,
        reason: "Invalid referer URL format"
      }
    }
  }

  // No origin or referer - likely direct API call, curl, Postman, or server-to-server
  return { 
    valid: false, 
    origin: null,
    reason: "Missing origin and referer headers"
  }
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
    const { valid, origin, reason } = verifyOrigin(request)
    
    if (!valid) {
      console.warn(
        `[CSRF] Blocked request - Reason: ${reason || "Unknown"} | Origin: ${origin || "none"} | Method: ${request.method} | Path: ${request.nextUrl.pathname}`
      )
      return NextResponse.json(
        { message: "Forbidden - Invalid origin" },
        { status: 403 }
      )
    }

    return handler(request)
  }
}

/**
 * Add CORS headers to response for allowed origins
 */
export function addCORSHeaders(
  response: NextResponse,
  request: NextRequest
): NextResponse {
  const origin = request.headers.get("origin")
  
  if (origin && isOriginAllowed(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin)
    response.headers.set("Access-Control-Allow-Credentials", "true")
    response.headers.set(
      "Access-Control-Allow-Methods",
      corsConfig.allowedMethods.join(", ")
    )
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, X-CSRF-Token"
    )
    response.headers.set("Access-Control-Max-Age", String(corsConfig.maxAge))
  }
  
  return response
}

/**
 * Handle CORS preflight requests
 */
export function handlePreflight(request: NextRequest): NextResponse | null {
  if (request.method === "OPTIONS") {
    const { valid, origin } = verifyOrigin(request)
    
    if (!valid) {
      return new NextResponse(null, { status: 403 })
    }
    
    const response = new NextResponse(null, { status: 204 })
    if (origin) {
      response.headers.set("Access-Control-Allow-Origin", origin)
      response.headers.set("Access-Control-Allow-Credentials", "true")
      response.headers.set(
        "Access-Control-Allow-Methods",
        corsConfig.allowedMethods.join(", ")
      )
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Requested-With, X-CSRF-Token"
      )
      response.headers.set("Access-Control-Max-Age", String(corsConfig.maxAge))
    }
    
    return response
  }
  
  return null
}

/**
 * Get list of allowed origins (for debugging/monitoring)
 */
export function getAllowedOrigins(): string[] {
  return [...corsConfig.allowedOrigins]
}

/**
 * Check if origin is allowed (exported for testing)
 */
export function checkOrigin(origin: string): boolean {
  return isOriginAllowed(origin)
}
