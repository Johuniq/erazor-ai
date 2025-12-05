"use client"

import { X } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export function ProductHuntBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="relative bg-gradient-to-r from-[#da552f] to-[#ea7e38] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2.5 text-sm sm:gap-4 sm:px-6">
        <span className="hidden sm:inline">We're live on</span>
        <Link
          href="https://producthunt.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-semibold hover:underline"
        >
          <svg className="h-5 w-5" viewBox="0 0 40 40" fill="currentColor">
            <path d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z" />
            <path
              d="M22.5 20H17V14H22.5C24.1569 14 25.5 15.3431 25.5 17C25.5 18.6569 24.1569 20 22.5 20Z"
              fill="#da552f"
            />
            <path d="M17 14V26H14V14H17Z" fill="#da552f" />
            <path
              d="M22.5 14H17V20H22.5C24.1569 20 25.5 18.6569 25.5 17C25.5 15.3431 24.1569 14 22.5 14Z"
              fill="#da552f"
            />
          </svg>
          <span>Product Hunt</span>
        </Link>
        <span className="hidden sm:inline">- Support us with an upvote!</span>
        <span className="inline sm:hidden">- Upvote us!</span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-white/20 sm:right-4"
        aria-label="Dismiss banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
