/**
 * Simple in-memory rate limiter for API routes
 * For production, use Redis-based solution like @upstash/ratelimit
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map()
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      const now = Date.now()
      for (const [key, entry] of this.limits.entries()) {
        if (now > entry.resetAt) {
          this.limits.delete(key)
        }
      }
    }, 5 * 60 * 1000)
  }

  /**
   * Check if request is allowed under rate limit
   * @param identifier - User ID, IP address, or fingerprint
   * @param maxRequests - Maximum requests allowed in window
   * @param windowMs - Time window in milliseconds
   * @returns Object with success status and remaining requests
   */
  check(
    identifier: string,
    maxRequests: number,
    windowMs: number
  ): { success: boolean; remaining: number; resetAt: number } {
    const now = Date.now()
    const entry = this.limits.get(identifier)

    if (!entry || now > entry.resetAt) {
      // No entry or expired - create new
      const resetAt = now + windowMs
      this.limits.set(identifier, { count: 1, resetAt })
      return { success: true, remaining: maxRequests - 1, resetAt }
    }

    if (entry.count >= maxRequests) {
      // Rate limit exceeded
      return { success: false, remaining: 0, resetAt: entry.resetAt }
    }

    // Increment count
    entry.count++
    this.limits.set(identifier, entry)
    return { success: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt }
  }

  cleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    this.limits.clear()
  }
}

// Singleton instance
let rateLimiterInstance: RateLimiter | null = null

export function getRateLimiter(): RateLimiter {
  if (!rateLimiterInstance) {
    rateLimiterInstance = new RateLimiter()
  }
  return rateLimiterInstance
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  // Authenticated image processing - 20 requests per hour
  PROCESS_AUTH: {
    maxRequests: 20,
    windowMs: 60 * 60 * 1000,
  },
  // Anonymous image processing - 5 requests per hour
  PROCESS_ANON: {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000,
  },
  // Checkout requests - 10 per hour
  CHECKOUT: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000,
  },
}
