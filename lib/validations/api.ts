import { z } from "zod"

/**
 * Validation schemas for API routes
 * Prevents injection attacks and ensures data integrity
 */

// File validation
export const fileSchema = z.object({
  name: z.string()
    .min(1, "Filename is required")
    .max(255, "Filename too long")
    .regex(/^[a-zA-Z0-9-_. ]+$/, "Invalid filename characters"),
  size: z.number()
    .positive("File size must be positive")
    .max(10 * 1024 * 1024, "File size exceeds 10MB"),
  type: z.enum(["image/jpeg", "image/png", "image/webp", "image/jpg"], {
    errorMap: () => ({ message: "Invalid file type. Only JPEG, PNG, and WebP are allowed" })
  })
})

// Processing type validation
export const processingTypeSchema = z.enum(["bg_removal", "upscale"], {
  errorMap: () => ({ message: "Invalid processing type. Must be 'bg_removal' or 'upscale'" })
})

// Fingerprint validation (for anonymous users)
export const fingerprintSchema = z.string()
  .min(10, "Invalid fingerprint")
  .max(100, "Invalid fingerprint")
  .regex(/^[a-zA-Z0-9-_]+$/, "Invalid fingerprint format")

// UUID validation
export const uuidSchema = z.string()
  .uuid("Invalid UUID format")

// Email validation
export const emailSchema = z.string()
  .email("Invalid email address")
  .max(255, "Email too long")

// Process request validation (authenticated)
export const processRequestSchema = z.object({
  type: processingTypeSchema,
  image: z.object({
    name: z.string().max(255),
    size: z.number().max(10 * 1024 * 1024),
    type: z.enum(["image/jpeg", "image/png", "image/webp", "image/jpg"])
  })
})

// Process request validation (public/anonymous)
export const publicProcessRequestSchema = z.object({
  type: processingTypeSchema,
  fingerprint: fingerprintSchema,
  image: z.object({
    name: z.string().max(255),
    size: z.number().max(5 * 1024 * 1024, "File size exceeds 5MB for free users"),
    type: z.enum(["image/jpeg", "image/png", "image/webp", "image/jpg"])
  })
})

// Credits check validation
export const creditsRequestSchema = z.object({
  fingerprint: fingerprintSchema
})

// Checkout validation
export const checkoutRequestSchema = z.object({
  priceId: z.string()
    .min(1, "Price ID is required")
    .regex(/^[a-zA-Z0-9-_]+$/, "Invalid price ID format")
})

// Status check validation
export const statusRequestSchema = z.object({
  id: z.string()
    .min(1, "Job ID is required")
    .max(100, "Job ID too long"),
  type: processingTypeSchema
})

/**
 * Helper function to validate and sanitize FormData
 */
export function validateFormData<T>(
  data: FormData,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: string } {
  try {
    const parsed = schema.parse(Object.fromEntries(data))
    return { success: true, data: parsed }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.errors[0]?.message || "Validation failed" 
      }
    }
    return { success: false, error: "Invalid input" }
  }
}

/**
 * Helper function to validate JSON body
 */
export function validateJSON<T>(
  body: unknown,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: string } {
  try {
    const parsed = schema.parse(body)
    return { success: true, data: parsed }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.errors[0]?.message || "Validation failed" 
      }
    }
    return { success: false, error: "Invalid input" }
  }
}

/**
 * Sanitize filename to prevent directory traversal
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9-_. ]/g, "_") // Replace invalid chars
    .replace(/\.{2,}/g, "_") // Prevent ../ attacks
    .replace(/^\.+/, "") // Remove leading dots
    .slice(0, 255) // Limit length
}
