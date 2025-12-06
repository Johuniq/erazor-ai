/**
 * Enhanced fetch with timeout and retry logic
 * Prevents hanging requests from blocking server resources
 */

export interface FetchWithTimeoutOptions extends RequestInit {
  timeout?: number // Timeout in milliseconds (default: 30000)
  retries?: number // Number of retry attempts (default: 2)
  retryDelay?: number // Delay between retries in ms (default: 1000)
  onRetry?: (attempt: number, error: Error) => void
}

export class FetchTimeoutError extends Error {
  constructor(timeout: number) {
    super(`Request timeout after ${timeout}ms`)
    this.name = "FetchTimeoutError"
  }
}

export class FetchRetryError extends Error {
  constructor(attempts: number, lastError: Error) {
    super(`Request failed after ${attempts} attempts: ${lastError.message}`)
    this.name = "FetchRetryError"
    this.cause = lastError
  }
}

/**
 * Fetch with automatic timeout and retry logic
 * @param url - The URL to fetch
 * @param options - Fetch options with additional timeout/retry configs
 * @returns Promise<Response>
 * @throws FetchTimeoutError if request times out after all retries
 * @throws FetchRetryError if all retry attempts fail
 */
export async function fetchWithTimeout(
  url: string | URL,
  options: FetchWithTimeoutOptions = {}
): Promise<Response> {
  const {
    timeout = 30000, // 30 seconds default
    retries = 2, // 2 retries default (3 total attempts)
    retryDelay = 1000, // 1 second between retries
    onRetry,
    ...fetchOptions
  } = options

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      try {
        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
        return response
      } finally {
        clearTimeout(timeoutId)
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Check if it's an abort error (timeout)
      if (lastError.name === "AbortError") {
        lastError = new FetchTimeoutError(timeout)
      }

      // If this is not the last attempt, retry
      if (attempt < retries) {
        if (onRetry) {
          onRetry(attempt + 1, lastError)
        }

        console.warn(
          `[Fetch Retry] Attempt ${attempt + 1}/${retries + 1} failed for ${url}:`,
          lastError.message,
          `Retrying in ${retryDelay}ms...`
        )

        // Wait before retrying (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, retryDelay * (attempt + 1)))
        continue
      }

      // All retries exhausted
      break
    }
  }

  // All attempts failed
  throw new FetchRetryError(retries + 1, lastError!)
}

/**
 * Fetch JSON with timeout and retry
 * Convenience wrapper that also parses JSON
 */
export async function fetchJSON<T = any>(
  url: string | URL,
  options: FetchWithTimeoutOptions = {}
): Promise<T> {
  const response = await fetchWithTimeout(url, options)

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Configuration presets for different use cases
 */
export const fetchPresets = {
  // Fast operations (status checks, health checks)
  fast: {
    timeout: 10000, // 10s
    retries: 1,
    retryDelay: 500,
  },

  // Standard operations (most API calls)
  standard: {
    timeout: 30000, // 30s
    retries: 2,
    retryDelay: 1000,
  },

  // Long operations (image processing, uploads)
  long: {
    timeout: 60000, // 60s
    retries: 2,
    retryDelay: 2000,
  },

  // Critical operations (no retries, fast timeout)
  critical: {
    timeout: 5000, // 5s
    retries: 0,
    retryDelay: 0,
  },
} as const
