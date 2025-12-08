"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getDisplayReadyUrl, releaseObjectUrl } from "@/lib/display-ready-url"
import { generateFingerprint } from "@/lib/fingerprint"
import { useUserStore } from "@/lib/store/user-store"
import { AlertCircle, ArrowRight, CheckCircle2, Download, ImageIcon, Loader2, Sparkles, Upload, X } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"

interface ImageProcessorProps {
  type: "bg_removal" | "upscale"
  title: string
  description: string
  isAuthenticated?: boolean
  userCredits?: number
}

export function ImageProcessor({ type, title, description, isAuthenticated = false, userCredits }: ImageProcessorProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<string | null>(null)
  const [resultDownloadUrl, setResultDownloadUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [credits, setCredits] = useState<number | null>(isAuthenticated && userCredits !== undefined ? userCredits : null)
  const [requiresSignup, setRequiresSignup] = useState(false)
  const [fingerprint, setFingerprint] = useState<string | null>(null)
  
  // Get user store for authenticated users to sync credits
  const { deductCredits } = useUserStore()

  const isLocalUrl = (url: string) => url.startsWith("blob:") || url.startsWith("data:")

  // Generate fingerprint on mount (only for anonymous users)
  useEffect(() => {
    if (!isAuthenticated) {
      generateFingerprint().then(setFingerprint)
    }
  }, [isAuthenticated])

  // Check credits on mount (only for anonymous users)
  useEffect(() => {
    // If authenticated, use userCredits passed from server
    if (isAuthenticated) {
      if (userCredits !== undefined) {
        setCredits(userCredits)
      }
      return
    }

    // For anonymous users, fetch credits using fingerprint
    if (!fingerprint) return

    fetch("/api/public/credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fingerprint }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch credits')
        return res.json()
      })
      .then((data) => {
        // Ensure we have a valid number
        const creditValue = typeof data.credits === 'number' ? data.credits : 3
        setCredits(creditValue)
      })
      .catch((error) => {
        console.error('Credits fetch error:', error)
        setCredits(3) // Fallback to default
      })
  }, [fingerprint, isAuthenticated, userCredits])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setFile(file)
      if (preview) releaseObjectUrl(preview)
      setPreview(URL.createObjectURL(file))
      if (result) releaseObjectUrl(result)
      setResult(null)
      setResultDownloadUrl(null)
      setError(null)
      setRequiresSignup(false)
    }
  }, [preview, result])

  useEffect(() => {
    return () => {
      releaseObjectUrl(preview)
      releaseObjectUrl(result)
    }
  }, [preview, result])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const processImage = async () => {
    if (!file) return
    // For authenticated users, we don't need fingerprint
    if (!isAuthenticated && !fingerprint) return

    setProcessing(true)
    setProgress(10)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("image", file)
      formData.append("type", type)
      
      // Use authenticated API if user is logged in, otherwise use public API
      const apiEndpoint = isAuthenticated ? "/api/process" : "/api/public/process"
      
      // Only add fingerprint for anonymous users
      if (!isAuthenticated && fingerprint) {
        formData.append("fingerprint", fingerprint)
      }

      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.requiresSignup) {
          setRequiresSignup(true)
          setCredits(0)
        }
        throw new Error(data.message || "Processing failed")
      }

      setProgress(30)
      
      // Update credits based on response
      if (isAuthenticated) {
        // For authenticated users, decrement locally and sync with store (server already deducted)
        if (credits !== null && credits > 0) {
          setCredits(credits - 1)
        }
        // Sync with user store
        deductCredits(1)
      } else {
        // For anonymous users, use credits_remaining from response
        const remainingCredits = typeof data.credits_remaining === 'number' 
          ? data.credits_remaining 
          : (credits !== null ? Math.max(0, credits - 1) : 0)
        setCredits(remainingCredits)
      }

      // Poll for result
      const jobId = data.job_id
      let attempts = 0
      const maxAttempts = 60

      // Use different status endpoints for authenticated vs anonymous users
      const statusEndpoint = isAuthenticated 
        ? `/api/process/${jobId}?type=${type}`
        : `/api/public/process/${jobId}?type=${type}`

      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setProgress(Math.min(30 + (attempts / maxAttempts) * 60, 90))

        const statusRes = await fetch(statusEndpoint)
        const statusData = await statusRes.json()

        if (statusData.status === "completed" && statusData.result_url) {
          const remoteResultUrl = statusData.result_url
          setProgress(95)
          const displayUrl = await getDisplayReadyUrl(remoteResultUrl)
          setResult((current) => {
            if (current) {
              releaseObjectUrl(current)
            }
            return displayUrl
          })
          setResultDownloadUrl(remoteResultUrl)
          setProgress(100)
          break
        } else if (statusData.status === "failed") {
          throw new Error("Processing failed")
        }

        attempts++
      }

      if (attempts >= maxAttempts) {
        throw new Error("Processing timed out")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setProcessing(false)
    }
  }

  const reset = () => {
    setFile(null)
    if (preview) releaseObjectUrl(preview)
    setPreview(null)
    setResult((current) => {
      if (current) {
        releaseObjectUrl(current)
      }
      return null
    })
    setResultDownloadUrl(null)
    setError(null)
    setProgress(0)
    setRequiresSignup(false)
  }

  const downloadResult = async () => {
    const targetUrl = resultDownloadUrl || result
    if (!targetUrl) return

    const directDownload = () => {
      const a = document.createElement("a")
      a.href = targetUrl
      a.download = `erazor-${type}-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }

    try {
      if (isLocalUrl(targetUrl)) {
        directDownload()
        return
      }

      const response = await fetch(targetUrl, {
        mode: 'cors',
        credentials: 'omit'
      })
      if (!response.ok) throw new Error('Download failed')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `erazor-${type}-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
      // Fallback: open in new tab
      window.open(targetUrl, "_blank")
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Credits Badge - Only show for anonymous users */}
      {!isAuthenticated && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <Badge variant={credits === 0 ? "destructive" : "secondary"} className="text-xs sm:text-sm">
            {credits !== null ? `${credits} credits remaining` : "Loading..."}
          </Badge>
          {credits !== null && credits < 3 && (
            <Link href="/signup" className="text-xs sm:text-sm text-primary hover:underline">
              Sign up for more credits
            </Link>
          )}
        </div>
      )}

      {/* Upload Area - Only show when no preview */}
      {!preview && (
        <Card
          {...getRootProps()}
          className={`relative cursor-pointer border-2 border-dashed p-6 sm:p-10 lg:p-12 text-center transition-all ${
            isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 items-center justify-center rounded-full bg-primary/10">
              <Upload className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-primary" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-medium">{isDragActive ? "Drop your image here" : "Drag & drop your image"}</p>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">or click to browse (JPG, PNG, WebP up to 10MB)</p>
            </div>
          </div>
        </Card>
      )}

      {/* Split View - Show when preview is available */}
      {preview && (
        <Card className="overflow-hidden">
          {/* Success banner - only show when result is ready */}
          {result && (
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-3 sm:p-4">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base font-medium">Processing complete!</span>
              </div>
            </div>
          )}

          {/* Split view grid */}
          <div className="grid gap-3 sm:gap-4 p-3 sm:p-4 md:grid-cols-2">
            {/* Original Image */}
            <div className="space-y-1.5 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Original</p>
              <div className="aspect-square overflow-hidden rounded-lg border border-border bg-muted relative">
                <img src={preview || "/placeholder.svg"} alt="Original image" className="h-full w-full object-contain" />
                {!processing && !result && (
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="absolute right-2 top-2 h-8 w-8 rounded-full shadow-md" 
                    onClick={reset}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Result/Processing Area */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-xs sm:text-sm font-medium text-primary">
                  {result ? "Processed" : processing ? "Processing..." : "Preview"}
                </p>
                {processing && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
              </div>
              <div className="aspect-square overflow-hidden rounded-lg border-2 border-primary/20 bg-[repeating-conic-gradient(oklch(0.96_0.005_265)_0%_25%,transparent_0%_50%)] bg-[length:16px_16px] relative">
                {result ? (
                  <img src={result || "/placeholder.svg"} alt="Processed image" className="h-full w-full object-contain" />
                ) : processing ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <div className="relative">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                        <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                      </div>
                      <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
                    </div>
                    <div className="text-center px-4">
                      <p className="text-sm font-medium text-primary">AI is working its magic</p>
                      <p className="text-xs text-muted-foreground mt-1">This usually takes 5-15 seconds</p>
                      <Progress value={progress} className="h-2 mt-3 max-w-[200px] mx-auto" />
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p className="text-xs">Result will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="border-t border-border p-3 sm:p-4">
            {error ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span className="text-xs sm:text-sm">{error}</span>
                </div>
                {requiresSignup ? (
                  <Button asChild size="sm" className="w-full sm:w-auto">
                    <Link href="/signup">
                      Sign up for more
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button onClick={processImage} size="sm" className="w-full sm:w-auto">Try Again</Button>
                )}
              </div>
            ) : result ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button onClick={downloadResult} className="gap-2 flex-1" size="sm">
                  <Download className="h-4 w-4" />
                  Download Result
                </Button>
                <Button variant="outline" onClick={reset} size="sm" className="flex-1">
                  Process Another
                </Button>
              </div>
            ) : !processing ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate">{file?.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{file && (file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button onClick={processImage} disabled={credits === 0} className="gap-2 w-full sm:w-auto" size="sm">
                  <Sparkles className="h-4 w-4" />
                  {type === "bg_removal" ? "Remove Background" : "Upscale Image"}
                </Button>
              </div>
            ) : null}
          </div>
        </Card>
      )}
    </div>
  )
}
