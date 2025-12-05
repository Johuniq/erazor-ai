import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// File size limits by plan (in bytes)
export const FILE_SIZE_LIMITS = {
  free: 2 * 1024 * 1024, // 2MB
  pro: 10 * 1024 * 1024, // 10MB
  enterprise: 20 * 1024 * 1024, // 20MB
} as const

export function getFileSizeLimit(plan: string | null | undefined): number {
  const normalizedPlan = (plan || 'free').toLowerCase()
  if (normalizedPlan.includes('enterprise')) return FILE_SIZE_LIMITS.enterprise
  if (normalizedPlan.includes('pro')) return FILE_SIZE_LIMITS.pro
  return FILE_SIZE_LIMITS.free
}

export function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(0)}MB`
  }
  return `${(bytes / 1024).toFixed(0)}KB`
}
