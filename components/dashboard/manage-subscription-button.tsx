"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink, Loader2 } from "lucide-react"
import { useState } from "react"

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/polar-portal")
      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error("Failed to get portal URL:", data.error)
      }
    } catch (error) {
      console.error("Error opening portal:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleClick} disabled={loading} className="gap-1.5">
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          Manage Subscription
          <ExternalLink className="h-4 w-4" />
        </>
      )}
    </Button>
  )
}
