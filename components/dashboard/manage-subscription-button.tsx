"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ExternalLink, Loader2 } from "lucide-react"
import { useState } from "react"

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleClick = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/polar-portal")
      const data = await response.json()

      if (!response.ok) {
        toast({
          title: "Error",
          description: data.message || "Failed to open billing portal",
          variant: "destructive",
        })
        return
      }

      if (data.url) {
        window.open(data.url, "_blank")
      } else {
        toast({
          title: "Error",
          description: "No portal URL returned",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error opening portal:", error)
      toast({
        title: "Error",
        description: "Failed to connect to billing service",
        variant: "destructive",
      })
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
