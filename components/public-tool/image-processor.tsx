"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { generateFingerprint } from "@/lib/fingerprint"
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
  const [error, setError] = useState<string | null>(null)
  const [credits, setCredits] = useState<number | null>(isAuthenticated && userCredits !== undefined ? userCredits : null)
  const [requiresSignup, setRequiresSignup] = useState(false)
  const [fingerprint, setFingerprint] = useState<string | null>(null)

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
      setPreview(URL.createObjectURL(file))
      setResult(null)
      setError(null)
      setRequiresSignup(false)
    }
  }, [])

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
        // For authenticated users, decrement locally (server already deducted)
        if (credits !== null && credits > 0) {
          setCredits(credits - 1)
        }
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
          setResult(statusData.result_url)
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
    setPreview(null)
    setResult(null)
    setError(null)
    setProgress(0)
    setRequiresSignup(false)
  }

  const downloadResult = async () => {
    if (!result) return

    try {
      const response = await fetch(result, {
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
      window.open(result, "_blank")
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Credits Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <Badge variant={credits === 0 ? "destructive" : "secondary"} className="text-xs sm:text-sm">
          {credits !== null ? `${credits} credits remaining` : "Loading..."}
        </Badge>
        {credits !== null && credits < 3 && !isAuthenticated && (
          <Link href="/signup" className="text-xs sm:text-sm text-primary hover:underline">
            Sign up for more credits
          </Link>
        )}
        {isAuthenticated && credits !== null && credits < 50 && (
          <Link href="/dashboard/billing" className="text-xs sm:text-sm text-primary hover:underline">
            Get more credits
          </Link>
        )}
      </div>

      {/* Upload Area */}
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

      {/* Preview & Processing */}
      {preview && !result && (
        <Card className="overflow-hidden">
          <div className="relative aspect-video bg-muted">
            <img src={preview || "/placeholder.svg"} alt="Image preview before processing" className="h-full w-full object-contain" />
            <Button variant="secondary" size="icon" className="absolute right-2 top-2 sm:right-4 sm:top-4 h-8 w-8 sm:h-10 sm:w-10" onClick={reset}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="border-t border-border p-3 sm:p-4">
            {processing ? (
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-xs sm:text-sm font-medium">Processing your image...</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            ) : error ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
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
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
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
            )}
          </div>
        </Card>
      )}

      {/* Result */}
      {result && (
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-3 sm:p-4">
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base font-medium">Processing complete!</span>
            </div>
          </div>
          <div className="grid gap-3 sm:gap-4 p-3 sm:p-4 md:grid-cols-2">
            {/* Before */}
            <div className="space-y-1.5 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Original</p>
              <div className="aspect-square overflow-hidden rounded-lg border border-border bg-muted">
                <img src={preview! || "/placeholder.svg"} alt="Original image before AI processing" className="h-full w-full object-contain" />
              </div>
            </div>
            {/* After */}
            <div className="space-y-1.5 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-primary">Processed</p>
              <div className="aspect-square overflow-hidden rounded-lg border-2 border-primary/20 bg-[repeating-conic-gradient(oklch(0.96_0.005_265)_0%_25%,transparent_0%_50%)] bg-[length:16px_16px]">
                <img src={result || "/placeholder.svg"} alt="AI processed result image" className="h-full w-full object-contain" />
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 border-t border-border p-3 sm:p-4">
            <Button onClick={downloadResult} className="gap-2 flex-1" size="sm">
              <Download className="h-4 w-4" />
              Download Result
            </Button>
            <Button variant="outline" onClick={reset} size="sm" className="flex-1">
              Process Another
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
