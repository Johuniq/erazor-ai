export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  credits: number
  plan: "free" | "pro" | "enterprise"
  polar_customer_id: string | null
  polar_subscription_id: string | null
  created_at: string
  updated_at: string
}

export interface ProcessingJob {
  id: string
  user_id: string
  job_type: "bg_removal" | "upscale"
  external_job_id: string | null
  source_url: string
  result_url: string | null
  status: "pending" | "processing" | "completed" | "failed"
  credits_used: number
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface CreditTransaction {
  id: string
  user_id: string
  amount: number
  type: "purchase" | "usage" | "bonus" | "refund"
  description: string | null
  reference_id: string | null
  created_at: string
}

// Icons8 API Response Types
export interface Icons8ImageSource {
  width: number
  height: number
  type: string
  url: string
}

export interface Icons8BGRemovalResponse {
  id: string
  source: Icons8ImageSource
  processed: Icons8ImageSource | null
  status: number
  statusName: "queue" | "processing" | "ready" | "error"
}

export interface Icons8UpscaleResponse {
  id: string
  enhancement: number
  source: Icons8ImageSource
  enhanced: Icons8ImageSource | null
  status: number
  statusName: "queue" | "processing" | "ready" | "maxEnhanced" | "error"
}

// Pricing Plans
export interface PricingPlan {
  id: string
  name: string
  description: string
  price: number
  credits: number
  features: string[]
  polar_product_id?: string
  popular?: boolean
}

// Anonymous user types
export interface AnonUser {
  id: string
  fingerprint: string
  credits: number
  created_at: string
  updated_at: string
}

export interface AnonProcessingJob {
  id: string
  anon_user_id: string
  job_type: "bg_removal" | "upscale"
  external_job_id: string | null
  source_url: string
  result_url: string | null
  status: "pending" | "processing" | "completed" | "failed"
  created_at: string
  updated_at: string
}
