"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Link from "next/link"

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      // Delay showing the banner for better UX
      const timer = setTimeout(() => setShowBanner(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const acceptAll = () => {
    localStorage.setItem("cookie-consent", "all")
    setShowBanner(false)
  }

  const acceptEssential = () => {
    localStorage.setItem("cookie-consent", "essential")
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="relative rounded-xl border bg-background/95 p-4 shadow-lg backdrop-blur-sm md:p-6">
          <button
            onClick={acceptEssential}
            className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            <div className="flex-1 pr-6">
              <h3 className="font-semibold">We value your privacy</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By
                clicking &ldquo;Accept All&rdquo;, you consent to our use of cookies.{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Learn more
                </Link>
              </p>
            </div>
            <div className="flex flex-shrink-0 gap-2">
              <Button variant="outline" size="sm" onClick={acceptEssential}>
                Essential Only
              </Button>
              <Button size="sm" onClick={acceptAll}>
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
