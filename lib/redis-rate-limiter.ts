import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import type { NextRequest } from "next/server"

/**
 * Redis-based rate limiter using Upstash
 * Replaces in-memory rate limiter for production use
 * Works across multiple instances and serverless functions
 */

// Initialize Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

/**
 * Rate limiters for different endpoints
 */
export const rateLimiters = {
  // Authenticated image processing - 20 requests per hour
  processAuth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 h"),
    prefix: "ratelimit:process:auth",
    analytics: true,
  }),

  // Anonymous image processing - 5 requests per hour
  processAnon: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    prefix: "ratelimit:process:anon",
    analytics: true,
  }),

  // Checkout requests - 10 per hour
  checkout: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 h"),
    prefix: "ratelimit:checkout",
    analytics: true,
  }),

  // Auth endpoints (login/signup) - 10 per 15 minutes
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "15 m"),
    prefix: "ratelimit:auth",
    analytics: true,
  }),

  // IP-based rate limiters (additional protection layer)
  ipGlobal: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 h"), // 100 requests per hour per IP
    prefix: "ratelimit:ip:global",
    analytics: true,
  }),

  ipAuth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(50, "1 h"), // 50 auth requests per hour per IP
    prefix: "ratelimit:ip:auth",
    analytics: true,
  }),

  ipProcess: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "1 h"), // 30 process requests per hour per IP
    prefix: "ratelimit:ip:process",
    analytics: true,
  }),
}

/**
 * Helper function to check rate limit and return appropriate response
 */
export async function checkRateLimit(
  limiter: Ratelimit,
  identifier: string
): Promise<{
  success: boolean
  limit: number
  remaining: number
  reset: number
}> {
  const result = await limiter.limit(identifier)
  
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  }
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: {
  limit: number
  remaining: number
  reset: number
}) {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(result.reset),
  }
}

/**
 * Extract client IP address from request headers
 * Checks multiple headers in order of reliability
 */
export function getClientIP(request: NextRequest): string {
  // Check Vercel/Cloudflare headers first
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(",")[0].trim()
  }

  // Check other common headers
  const realIP = request.headers.get("x-real-ip")
  if (realIP) {
    return realIP
  }

  // Cloudflare specific
  const cfConnectingIP = request.headers.get("cf-connecting-ip")
  if (cfConnectingIP) {
    return cfConnectingIP
  }

  // Fallback to a default (should rarely happen in production)
  return "unknown"
}

/**
 * Check both user/fingerprint rate limit AND IP rate limit
 * Returns the most restrictive limit
 */
export async function checkCombinedRateLimit(
  request: NextRequest,
  userLimiter: Ratelimit,
  userId: string,
  ipLimiter?: Ratelimit
): Promise<{
  success: boolean
  limit: number
  remaining: number
  reset: number
  limitedBy?: "user" | "ip"
}> {
  // Check user/fingerprint rate limit
  const userResult = await userLimiter.limit(userId)

  // If IP limiter is provided, check IP rate limit as well
  if (ipLimiter) {
    const clientIP = getClientIP(request)
    const ipResult = await ipLimiter.limit(clientIP)

    // If either limit is exceeded, return the failed one
    if (!userResult.success) {
      return {
        success: false,
        limit: userResult.limit,
        remaining: userResult.remaining,
        reset: userResult.reset,
        limitedBy: "user",
      }
    }

    if (!ipResult.success) {
      return {
        success: false,
        limit: ipResult.limit,
        remaining: ipResult.remaining,
        reset: ipResult.reset,
        limitedBy: "ip",
      }
    }

    // Both passed, return the more restrictive one
    return {
      success: true,
      limit: Math.min(userResult.limit, ipResult.limit),
      remaining: Math.min(userResult.remaining, ipResult.remaining),
      reset: Math.max(userResult.reset, ipResult.reset),
    }
  }

  // No IP limiter, just return user result
  return {
    success: userResult.success,
    limit: userResult.limit,
    remaining: userResult.remaining,
    reset: userResult.reset,
    limitedBy: userResult.success ? undefined : "user",
  }
}
