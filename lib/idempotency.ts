import { redis } from "./redis-rate-limiter"

/**
 * Idempotency key manager to prevent duplicate requests
 * Uses Redis to track request processing and prevent race conditions
 */

const IDEMPOTENCY_TTL = 300 // 5 minutes
const PROCESSING_TTL = 60 // 1 minute for active processing

export interface IdempotencyResult {
  allowed: boolean
  status: "new" | "processing" | "completed"
  result?: any
}

/**
 * Generate idempotency key from request parameters
 */
export function generateIdempotencyKey(
  userId: string,
  operation: string,
  params: Record<string, any>
): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&")
  return `idempotency:${operation}:${userId}:${sortedParams}`
}

/**
 * Check if request is idempotent and should be processed
 * Returns the status and any cached result
 */
export async function checkIdempotency(
  key: string
): Promise<IdempotencyResult> {
  try {
    const status = await redis.get(key)

    if (!status) {
      // New request - mark as processing
      await redis.setex(key, PROCESSING_TTL, "processing")
      return {
        allowed: true,
        status: "new",
      }
    }

    if (status === "processing") {
      // Request is currently being processed by another instance
      return {
        allowed: false,
        status: "processing",
      }
    }

    // Request was already completed - return cached result
    const resultKey = `${key}:result`
    const cachedResult = await redis.get(resultKey)

    return {
      allowed: false,
      status: "completed",
      result: cachedResult ? JSON.parse(cachedResult as string) : null,
    }
  } catch (error) {
    console.error("Idempotency check error:", error)
    // Fail open - allow request if Redis is down
    return {
      allowed: true,
      status: "new",
    }
  }
}

/**
 * Mark request as completed and cache the result
 */
export async function completeIdempotentRequest(
  key: string,
  result: any
): Promise<void> {
  try {
    // Store result
    const resultKey = `${key}:result`
    await redis.setex(resultKey, IDEMPOTENCY_TTL, JSON.stringify(result))

    // Update status to completed
    await redis.setex(key, IDEMPOTENCY_TTL, "completed")
  } catch (error) {
    console.error("Failed to complete idempotent request:", error)
  }
}

/**
 * Cancel/release an idempotent request (e.g., on error)
 */
export async function releaseIdempotentRequest(key: string): Promise<void> {
  try {
    await redis.del(key)
  } catch (error) {
    console.error("Failed to release idempotent request:", error)
  }
}

/**
 * Create idempotency key from file content hash
 * Useful for deduplicating identical file uploads
 */
export async function hashFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}
