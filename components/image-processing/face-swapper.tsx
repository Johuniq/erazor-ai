"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getDisplayReadyUrl, releaseObjectUrl } from "@/lib/display-ready-url"
import { useUserStore } from "@/lib/store/user-store"
import { AlertCircle, CheckCircle2, Download, ImageIcon, Loader2, RefreshCw, Users, X } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"

interface FaceSwapperProps {
  isAuthenticated?: boolean
  userCredits?: number
  userPlan?: string
}

export function FaceSwapper({ isAuthenticated = false, userCredits, userPlan = "free" }: FaceSwapperProps) {
  const [targetFile, setTargetFile] = useState<File | null>(null)
  const [sourceFile, setSourceFile] = useState<File | null>(null)
  const [targetPreview, setTargetPreview] = useState<string | null>(null)
  const [sourcePreview, setSourcePreview] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [credits, setCredits] = useState<number | null>(isAuthenticated && userCredits !== undefined ? userCredits : null)
  const [jobId, setJobId] = useState<string | null>(null)
  
  const { deductCredits } = useUserStore()

  // Update credits from user store if authenticated
  useEffect(() => {
    if (isAuthenticated && userCredits !== undefined) {
      setCredits(userCredits)
    }
  }, [isAuthenticated, userCredits])

  const onDropTarget = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setTargetFile(file)
      if (targetPreview) releaseObjectUrl(targetPreview)
      setTargetPreview(URL.createObjectURL(file))
      setError(null)
    }
  }, [targetPreview])

  const onDropSource = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setSourceFile(file)
      if (sourcePreview) releaseObjectUrl(sourcePreview)
      setSourcePreview(URL.createObjectURL(file))
      setError(null)
    }
  }, [sourcePreview])

  const targetDropzone = useDropzone({
    onDrop: onDropTarget,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
    multiple: false,
  })

  const sourceDropzone = useDropzone({
    onDrop: onDropSource,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
    multiple: false,
  })

  useEffect(() => {
    return () => {
      releaseObjectUrl(targetPreview)
      releaseObjectUrl(sourcePreview)
      releaseObjectUrl(result)
    }
  }, [targetPreview, sourcePreview, result])

  const checkJobStatus = async (jobId: string) => {
    try {
      const response = await fetch(`/api/face-swap/${jobId}`)
      if (!response.ok) {
        throw new Error("Failed to check status")
      }

      const data = await response.json()

      if (data.status === "ready" && data.processed?.url) {
        setProcessing(false)
        setProgress(100)
        const displayUrl = await getDisplayReadyUrl(data.processed.url)
        setResult(displayUrl)
        setJobId(null)
        return true
      } else if (data.status === "failed") {
        throw new Error("Face swap processing failed")
      }

      return false
    } catch (error) {
      console.error("Status check error:", error)
      throw error
    }
  }

  const handleSwap = async () => {
    if (!targetFile || !sourceFile) {
      setError("Please upload both target and source images")
      return
    }

    if (!isAuthenticated) {
      setError("Please sign in to use face swap")
      return
    }

    if (credits !== null && credits < 2) {
      setError("Insufficient credits. Face swap requires 2 credits.")
      return
    }

    setProcessing(true)
    setProgress(0)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("target_image", targetFile)
      formData.append("source_image", sourceFile)

      setProgress(20)

      const response = await fetch("/api/face-swap", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Face swap failed")
      }

      // Update credits
      if (data.credits !== undefined) {
        setCredits(data.credits)
        deductCredits(2) // Deduct 2 credits for face swap
      }

      setJobId(data.jobId)
      setProgress(40)

      // Poll for result
      const pollInterval = setInterval(async () => {
        try {
          const completed = await checkJobStatus(data.jobId)
          if (completed) {
            clearInterval(pollInterval)
          } else {
            setProgress((prev) => Math.min(prev + 10, 90))
          }
        } catch (error) {
          clearInterval(pollInterval)
          setProcessing(false)
          setError(error instanceof Error ? error.message : "Failed to process face swap")
        }
      }, 3000)

      // Timeout after 2 minutes
      setTimeout(() => {
        clearInterval(pollInterval)
        if (processing) {
          setProcessing(false)
          setError("Processing timeout. Please try again.")
        }
      }, 120000)

    } catch (error) {
      setProcessing(false)
      setError(error instanceof Error ? error.message : "An error occurred")
    }
  }

  const handleReset = () => {
    if (targetPreview) releaseObjectUrl(targetPreview)
    if (sourcePreview) releaseObjectUrl(sourcePreview)
    if (result) releaseObjectUrl(result)
    setTargetFile(null)
    setSourceFile(null)
    setTargetPreview(null)
    setSourcePreview(null)
    setResult(null)
    setError(null)
    setProgress(0)
    setJobId(null)
  }

  const handleDownload = async () => {
    if (!result) return

    try {
      const response = await fetch(result)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `face-swap-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download error:", error)
      setError("Failed to download image")
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5">
          <Users className="h-4 w-4" />
          <span className="text-sm font-medium">AI Face Swapper</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Swap Faces with AI
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Upload two images and swap faces automatically. Perfect for fun photos, creative projects, and more.
        </p>
        {!isAuthenticated && (
          <Badge variant="outline" className="mt-2">
            2 Credits per swap • <Link href="/login" className="ml-1 underline">Sign in required</Link>
          </Badge>
        )}
        {isAuthenticated && credits !== null && (
          <Badge variant="secondary" className="mt-2">
            {credits} credits remaining • 2 credits per swap
          </Badge>
        )}
      </div>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Upload Section */}
        <div className="space-y-6">
          {/* Target Image Upload */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Target Image</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              This is the image where you want to replace the face
            </p>
            <div
              {...targetDropzone.getRootProps()}
              className={`relative cursor-pointer overflow-hidden rounded-lg border-2 border-dashed transition-colors ${
                targetDropzone.isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <input {...targetDropzone.getInputProps()} />
              {targetPreview ? (
                <div className="relative aspect-square">
                  <img
                    src={targetPreview}
                    alt="Target"
                    className="h-full w-full object-contain"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute right-2 top-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (targetPreview) releaseObjectUrl(targetPreview)
                      setTargetFile(null)
                      setTargetPreview(null)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 p-8">
                  <div className="rounded-full bg-primary/10 p-4">
                    <ImageIcon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Drop target image here</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      or click to browse
                    </p>
                  </div>
                  <Badge variant="secondary">PNG, JPG, WebP • Max 10MB</Badge>
                </div>
              )}
            </div>
          </Card>

          {/* Source Image Upload */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Source Face</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              This face will replace the face in the target image
            </p>
            <div
              {...sourceDropzone.getRootProps()}
              className={`relative cursor-pointer overflow-hidden rounded-lg border-2 border-dashed transition-colors ${
                sourceDropzone.isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <input {...sourceDropzone.getInputProps()} />
              {sourcePreview ? (
                <div className="relative aspect-square">
                  <img
                    src={sourcePreview}
                    alt="Source"
                    className="h-full w-full object-contain"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute right-2 top-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (sourcePreview) releaseObjectUrl(sourcePreview)
                      setSourceFile(null)
                      setSourcePreview(null)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 p-8">
                  <div className="rounded-full bg-primary/10 p-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Drop source face here</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      or click to browse
                    </p>
                  </div>
                  <Badge variant="secondary">PNG, JPG, WebP • Max 10MB</Badge>
                </div>
              )}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleSwap}
              disabled={!targetFile || !sourceFile || processing || !isAuthenticated}
              className="flex-1 gap-2"
              size="lg"
            >
              {processing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Swapping...
                </>
              ) : (
                <>
                  <RefreshCw className="h-5 w-5" />
                  Swap Faces
                </>
              )}
            </Button>
            {(targetFile || sourceFile || result) && (
              <Button
                onClick={handleReset}
                variant="outline"
                size="lg"
                disabled={processing}
              >
                Reset
              </Button>
            )}
          </div>

          {!isAuthenticated && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <AlertCircle className="mr-2 inline h-4 w-4" />
                Please <Link href="/login" className="font-medium underline">sign in</Link> to use face swap feature
              </p>
            </div>
          )}
        </div>

        {/* Result Section */}
        <div>
          <Card className="sticky top-24 p-6">
            <h3 className="mb-4 text-lg font-semibold">Result</h3>
            
            {error && (
              <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                  <div className="flex-1">
                    <p className="font-medium text-destructive">Error</p>
                    <p className="mt-1 text-sm text-destructive/90">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {processing && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="font-medium">Processing face swap...</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  This may take 30-60 seconds. Please wait...
                </p>
              </div>
            )}

            {result && !processing && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Face swap complete!</span>
                </div>
                
                <div className="overflow-hidden rounded-lg border">
                  <img
                    src={result}
                    alt="Result"
                    className="w-full object-contain"
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleDownload} className="flex-1 gap-2" size="lg">
                    <Download className="h-5 w-5" />
                    Download
                  </Button>
                </div>
              </div>
            )}

            {!result && !processing && !error && (
              <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8 text-center">
                <div className="rounded-full bg-muted p-4">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">
                    Upload both images to see the result
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your swapped image will appear here
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        <Card className="p-6">
          <div className="mb-3 inline-flex rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
            <Users className="h-6 w-6 text-blue-500" />
          </div>
          <h3 className="mb-2 font-semibold">AI-Powered</h3>
          <p className="text-sm text-muted-foreground">
            Advanced AI automatically detects and swaps faces with natural results
          </p>
        </Card>

        <Card className="p-6">
          <div className="mb-3 inline-flex rounded-lg bg-purple-50 p-3 dark:bg-purple-950">
            <CheckCircle2 className="h-6 w-6 text-purple-500" />
          </div>
          <h3 className="mb-2 font-semibold">High Quality</h3>
          <p className="text-sm text-muted-foreground">
            Maintains original image quality with seamless blending
          </p>
        </Card>

        <Card className="p-6">
          <div className="mb-3 inline-flex rounded-lg bg-green-50 p-3 dark:bg-green-950">
            <RefreshCw className="h-6 w-6 text-green-500" />
          </div>
          <h3 className="mb-2 font-semibold">Fast Processing</h3>
          <p className="text-sm text-muted-foreground">
            Get results in 30-60 seconds with our optimized AI models
          </p>
        </Card>
      </div>
    </div>
  )
}
