"use client"

import { ArrowUpRight, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export function ProductHuntBanner() {
  const [dismissed, setDismissed] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if banner was previously dismissed in this session
    const wasDismissed = sessionStorage.getItem("ph-banner-dismissed")
    if (!wasDismissed) {
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    sessionStorage.setItem("ph-banner-dismissed", "true")
    setTimeout(() => setDismissed(true), 300)
  }

  if (dismissed) return null

  return (
    <div 
      className={`relative overflow-hidden transition-all duration-300 ease-out ${
        isVisible ? "max-h-16 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#da552f] via-[#ea7e38] to-[#da552f] bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite] pointer-events-none" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-3 text-sm sm:gap-4 sm:px-6">
        {/* Animated sparkle icon */}        
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden sm:inline text-white/90 font-medium">🚀 We're live on</span>
          <span className="inline sm:hidden text-white/90 font-medium">🚀 Live on</span>
          
          <Link
            href="https://www.producthunt.com/products/erazor"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1.5 font-semibold text-white transition-all duration-200 hover:bg-white/25 hover:scale-105 hover:shadow-lg"
          >
            <svg className="h-5 w-5 transition-transform group-hover:rotate-12" viewBox="0 0 40 40" fill="currentColor">
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
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <span className="hidden md:inline text-white/90">—</span>
        
        <Link
          href="https://www.producthunt.com/products/erazor"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-1.5 text-white font-medium hover:text-yellow-200 transition-colors"
        >
          Support us with an upvote! 
          <span className="text-lg inline-block">👆</span>
        </Link>
        
        <span className="inline md:hidden text-white/90 font-medium">Upvote us! 👆</span>
      </div>

      <button
        onClick={handleDismiss}
        className="absolute z-10 right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200 sm:right-4"
        aria-label="Dismiss banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
