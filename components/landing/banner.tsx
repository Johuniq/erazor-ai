"use client"

import { ArrowUpRight, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export function Banner() {
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
      <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite] pointer-events-none" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-3 text-sm sm:gap-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden sm:inline text-white/90 font-semibold">🔥 BLACK FRIDAY:</span>
          <span className="inline sm:hidden text-white/90 font-semibold">🔥 BLACK FRIDAY</span>
          
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1.5 font-bold text-white">
            <span className="text-yellow-300">50% OFF</span>
            <span className="hidden sm:inline">All Plans</span>
          </div>
        </div>

        <span className="hidden md:inline text-white/90">—</span>
        
        <div className="hidden md:flex items-center gap-2 text-white">
          <span className="font-medium">Use code:</span>
          <code className="rounded bg-white/20 px-2 py-1 font-mono text-sm font-bold tracking-wider text-yellow-300">
            BF50
          </code>
        </div>
        
        <Link
          href="#pricing"
          className="hidden md:inline-flex items-center gap-1.5 text-white font-semibold hover:text-yellow-300 transition-colors"
        >
          Claim Deal
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
        
        <span className="inline md:hidden text-white/90 font-medium">Code: <span className="font-bold text-yellow-300">BF50</span></span>
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
