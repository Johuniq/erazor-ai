"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getDisplayReadyUrl, releaseObjectUrl } from "@/lib/display-ready-url"
import { useUserStore } from "@/lib/store/user-store"
import { AlertCircle, CheckCircle2, Download, Loader2, Upload, Users, X } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"

interface FaceSwapperProps {
  title: string
  description: string
  isAuthenticated?: boolean
  userCredits?: number
  userPlan?: string
}

export function FaceSwapper({ title, description, isAuthenticated = false, userCredits, userPlan = "free" }: FaceSwapperProps) {
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
      setResult(null)
    }
  }, [targetPreview])

  const onDropSource = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setSourceFile(file)
      if (sourcePreview) releaseObjectUrl(sourcePreview)
      setSourcePreview(URL.createObjectURL(file))
      setError(null)
      setResult(null)
    }
  }, [sourcePreview])

  const targetDropzone = useDropzone({
    onDrop: onDropTarget,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    multiple: false,
  })

  const sourceDropzone = useDropzone({
    onDrop: onDropSource,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
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
      if (!response.ok) throw new Error("Failed to check status")

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
      if (!response.ok) throw new Error(data.message || "Face swap failed")

      if (data.credits !== undefined) {
        setCredits(data.credits)
        deductCredits(2)
      }

      setJobId(data.jobId)
      setProgress(40)

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

  const reset = () => {
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

  const downloadResult = async () => {
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
      window.open(result, "_blank")
    }
  }

  const hasAnyImage = targetPreview || sourcePreview

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Auth Required Notice */}
      {!isAuthenticated && (
        <Card className="border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-yellow-800 dark:text-yellow-200" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Sign in required
              </p>
              <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                Please <Link href="/login" className="font-medium underline">sign in</Link> to use the face swap feature. Requires 2 credits per swap.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Credits Badge */}
      {isAuthenticated && credits !== null && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <Badge variant={credits < 2 ? "destructive" : "secondary"} className="text-xs sm:text-sm">
            {credits} credits remaining • 2 credits per swap
          </Badge>
          {credits < 2 && (
            <Link href="/dashboard/billing" className="text-xs sm:text-sm text-primary hover:underline">
              Get more credits
            </Link>
          )}
        </div>
      )}

      {/* Upload Areas */}
      {!hasAnyImage && (
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <Card
            {...targetDropzone.getRootProps()}
            className={`relative cursor-pointer border-2 border-dashed p-6 sm:p-10 text-center transition-all ${
              targetDropzone.isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
          >
            <input {...targetDropzone.getInputProps()} />
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-primary/10">
                <Upload className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-medium">Target Image</p>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  Image where face will be replaced
                </p>
                <p className="mt-2 text-xs text-muted-foreground">JPG, PNG, WebP up to 10MB</p>
              </div>
            </div>
          </Card>

          <Card
            {...sourceDropzone.getRootProps()}
            className={`relative cursor-pointer border-2 border-dashed p-6 sm:p-10 text-center transition-all ${
              sourceDropzone.isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
          >
            <input {...sourceDropzone.getInputProps()} />
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-medium">Source Face</p>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  Face to use for swap
                </p>
                <p className="mt-2 text-xs text-muted-foreground">JPG, PNG, WebP up to 10MB</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Split View */}
      {hasAnyImage && (
        <Card className="overflow-hidden">
          {result && (
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-3 sm:p-4">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base font-medium">Face swap complete!</span>
              </div>
            </div>
          )}

          <div className="grid gap-3 sm:gap-4 p-3 sm:p-4 md:grid-cols-3">
            {/* Target Image */}
            <div className="space-y-1.5 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Target Image</p>
              <div className="aspect-square overflow-hidden rounded-lg border border-border bg-muted relative">
                {targetPreview ? (
                  <>
                    <img src={targetPreview} alt="Target" className="h-full w-full object-contain" />
                    {!processing && !result && (
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        className="absolute right-2 top-2 h-7 w-7 rounded-full shadow-md" 
                        onClick={() => {
                          if (targetPreview) releaseObjectUrl(targetPreview)
                          setTargetFile(null)
                          setTargetPreview(null)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 mb-2" />
                      <p className="text-xs">No image</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Source Face */}
            <div className="space-y-1.5 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Source Face</p>
              <div className="aspect-square overflow-hidden rounded-lg border border-border bg-muted relative">
                {sourcePreview ? (
                  <>
                    <img src={sourcePreview} alt="Source" className="h-full w-full object-contain" />
                    {!processing && !result && (
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        className="absolute right-2 top-2 h-7 w-7 rounded-full shadow-md" 
                        onClick={() => {
                          if (sourcePreview) releaseObjectUrl(sourcePreview)
                          setSourceFile(null)
                          setSourcePreview(null)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Users className="mx-auto h-8 w-8 mb-2" />
                      <p className="text-xs">No face</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Result */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-xs sm:text-sm font-medium text-primary">
                  {result ? "Result" : processing ? "Processing..." : "Preview"}
                </p>
                {processing && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
              </div>
              <div className="aspect-square overflow-hidden rounded-lg border-2 border-primary/20 bg-[repeating-conic-gradient(oklch(0.96_0.005_265)_0%_25%,transparent_0%_50%)] bg-[length:16px_16px] relative">
                {result ? (
                  <img src={result} alt="Result" className="h-full w-full object-contain" />
                ) : processing ? (
                  <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
                    <div className="relative">
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border-4 border-primary/20" />
                      <div className="absolute inset-0 h-16 w-16 sm:h-20 sm:w-20 animate-spin rounded-full border-4 border-transparent border-t-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Swapping faces...</p>
                      <p className="mt-1 text-xs text-muted-foreground">30-60 seconds</p>
                    </div>
                    <Progress value={progress} className="w-full max-w-[180px]" />
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Users className="mx-auto h-8 w-8 mb-2" />
                      <p className="text-xs">Upload both images</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="px-3 sm:px-4 pb-3 sm:pb-4">
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 sm:p-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-destructive" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-destructive">Error</p>
                    <p className="text-xs sm:text-sm text-destructive/90">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 sm:gap-3 p-3 sm:p-4 border-t">
            {result ? (
              <>
                <Button onClick={downloadResult} className="flex-1 gap-2" size="lg">
                  <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                  Download Result
                </Button>
                <Button onClick={reset} variant="outline" size="lg">
                  New Swap
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleSwap}
                  disabled={!targetFile || !sourceFile || processing || !isAuthenticated}
                  className="flex-1 gap-2"
                  size="lg"
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      Swapping...
                    </>
                  ) : (
                    <>
                      <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                      Swap Faces
                    </>
                  )}
                </Button>
                <Button onClick={reset} variant="outline" size="lg" disabled={processing}>
                  Reset
                </Button>
              </>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
