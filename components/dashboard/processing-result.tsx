"use client"

import { Button } from "@/components/ui/button"
import { Check, Download, RefreshCw, Sparkles } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface ProcessingResultProps {
  originalUrl: string
  resultUrl: string
  downloadUrl?: string
  onReset: () => void
}

const isLocalUrl = (url: string) => url.startsWith("blob:") || url.startsWith("data:")

export function ProcessingResult({ originalUrl, resultUrl, downloadUrl, onReset }: ProcessingResultProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    const targetUrl = downloadUrl || resultUrl
    if (!targetUrl) return

    const triggerDirectDownload = () => {
      const link = document.createElement("a")
      link.href = targetUrl
      link.download = `erazor-processed-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success("Image downloaded successfully")
    }

    setIsDownloading(true)

    if (isLocalUrl(targetUrl)) {
      triggerDirectDownload()
      setIsDownloading(false)
      return
    }

    try {
      const response = await fetch(targetUrl, {
        mode: 'cors',
        credentials: 'omit'
      })
      if (!response.ok) throw new Error('Download failed')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `erazor-processed-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("Image downloaded successfully")
    } catch (error) {
      console.error('Download error:', error)
      // Fallback: open in new tab
      window.open(targetUrl, '_blank')
      toast.error("Opened in new tab - right-click to save")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Success banner */}
      <div className="flex items-center justify-center gap-3 rounded-xl bg-accent/10 border border-accent/20 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
          <Check className="h-4 w-4 text-accent" />
        </div>
        <div>
          <span className="font-semibold text-accent-foreground">Processing complete!</span>
          <span className="text-sm text-muted-foreground ml-2">Your image is ready to download</span>
        </div>
      </div>

      {/* Before/After comparison */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Original</span>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted/30 shadow-sm">
            <img
              src={originalUrl || "/placeholder.svg"}
              alt="Original image"
              className="h-full w-full object-contain p-2"
              loading="lazy"
            />
          </div>
        </div>

        {/* Arrow indicator for desktop */}
        <div className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          {/* This is positioned via the grid, arrow is decorative */}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Result</span>
            <Sparkles className="h-3.5 w-3.5 text-accent" />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-accent/30 shadow-lg shadow-accent/5 bg-[repeating-conic-gradient(hsl(var(--muted))_0%_25%,hsl(var(--background))_0%_50%)] bg-[length:20px_20px]">
            <img
              src={resultUrl || "/placeholder.svg"}
              alt="Processed image"
              className="h-full w-full object-contain p-2"
              loading="lazy"
            />
            {/* Subtle glow effect */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-accent/10" />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          className="gap-2 flex-1 h-12 text-base shadow-sm"
          size="lg"
        >
          <Download className="h-5 w-5" />
          {isDownloading ? "Downloading..." : "Download Result"}
        </Button>
        <Button variant="outline" onClick={onReset} className="gap-2 flex-1 h-12 text-base bg-transparent" size="lg">
          <RefreshCw className="h-5 w-5" />
          Process Another
        </Button>
      </div>
    </div>
  )
}
