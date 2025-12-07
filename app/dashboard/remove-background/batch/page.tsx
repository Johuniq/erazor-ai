"use client"

import { BatchUpload } from "@/components/dashboard/batch-upload"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useUserStore } from "@/lib/store/user-store"
import { getFileSizeLimit } from "@/lib/utils"
import JSZip from "jszip"
import { ArrowLeft, CheckCircle2, Download, ImageMinus, Lightbulb, Lock, Sparkles, XCircle, Zap } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface BatchResult {
  fileName: string
  status: "complete" | "error" | "processing"
  error?: string
  blob?: Blob
}

export default function BatchBackgroundRemovalPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<BatchResult[]>([])
  const { profile, fetchProfile, deductCredits } = useUserStore()
  const router = useRouter()

  // Fetch profile if not loaded
  useEffect(() => {
    if (!profile) {
      fetchProfile()
    }
  }, [profile, fetchProfile])

  const userPlan = profile?.plan || "free"

  // Check plan access
  useEffect(() => {
    if (profile) {
      console.log('=== Batch BG Removal Debug ===')
      console.log('Profile:', profile)
      console.log('Plan:', profile.plan)
      console.log('Plan lowercase:', profile.plan?.toLowerCase())
      
      const planLower = profile.plan?.toLowerCase() || "free"
      if (planLower !== "pro" && planLower !== "enterprise") {
        toast.error("Batch processing requires Pro or Enterprise plan")
        router.push("/dashboard/billing")
      }
    }
  }, [profile, router])

  const maxFileSize = getFileSizeLimit(userPlan)
  const maxBatchSize = userPlan.toLowerCase() === "enterprise" ? 50 : 25

  const handleBatchUpload = async (files: File[]) => {
    setIsProcessing(true)
    const newResults: BatchResult[] = files.map(file => ({
      fileName: file.name,
      status: "processing" as const
    }))
    setResults(newResults)

    try {
      // Process files in parallel batches of 5
      const batchSize = 5
      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize)
        
        const promises = batch.map(async (file, batchIndex) => {
          const resultIndex = i + batchIndex
          try {
            const formData = new FormData()
            formData.append("image", file)
            formData.append("type", "bg_removal")

            const response = await fetch("/api/process", {
              method: "POST",
              body: formData,
            })

            if (!response.ok) {
              const errorData = await response.json()
              throw new Error(errorData.message || "Processing failed")
            }

            const data = await response.json()
            
            // Poll for result
            const pollResult = async (jobId: string): Promise<string> => {
              const statusResponse = await fetch(`/api/process/${jobId}?type=bg_removal`)
              const statusData = await statusResponse.json()

              if (statusData.status === "completed" && statusData.result_url) {
                return statusData.result_url
              } else if (statusData.status === "failed") {
                throw new Error("Processing failed")
              }

              await new Promise((resolve) => setTimeout(resolve, 2000))
              return pollResult(jobId)
            }

            const resultUrl = await pollResult(data.job_id)
            
            // Fetch the processed image as blob
            const imageResponse = await fetch(resultUrl)
            if (!imageResponse.ok) {
              throw new Error("Failed to download processed image")
            }
            const blob = await imageResponse.blob()

            // Deduct credit
            await deductCredits(1)

            return {
              fileName: file.name,
              status: "complete" as const,
              blob
            }
          } catch (error) {
            console.error(`Error processing ${file.name}:`, error)
            return {
              fileName: file.name,
              status: "error" as const,
              error: error instanceof Error ? error.message : "Processing failed",
            }
          }
        })

        const batchResults = await Promise.all(promises)
        
        // Update results array
        setResults(prev => {
          const updated = [...prev]
          batchResults.forEach((result, batchIndex) => {
            updated[i + batchIndex] = result
          })
          return updated
        })

        // Show progress toast
        const completedCount = results.filter(r => r.status === "complete").length + batchResults.filter(r => r.status === "complete").length
        toast.success(`Processed ${completedCount} of ${files.length} images`)
      }

      const successCount = results.filter(r => r.status === "complete").length
      toast.success(`Batch processing complete! ${successCount} images processed`)
    } catch (error) {
      console.error("Batch processing error:", error)
      toast.error("Batch processing failed")
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadAll = async () => {
    const completedResults = results.filter(r => r.status === "complete" && r.blob)
    
    if (completedResults.length === 0) {
      toast.error("No processed images to download")
      return
    }

    try {
      const zip = new JSZip()
      
      // Add each processed image to the ZIP
      completedResults.forEach((result) => {
        if (result.blob) {
          const extension = result.fileName.split('.').pop()
          const nameWithoutExt = result.fileName.replace(/\.[^/.]+$/, "")
          zip.file(`${nameWithoutExt}_processed.${extension}`, result.blob)
        }
      })

      // Generate the ZIP file
      toast.loading("Creating ZIP file...")
      const zipBlob = await zip.generateAsync({ type: "blob" })
      
      // Create download link
      const url = URL.createObjectURL(zipBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `processed-images-${Date.now()}.zip`
      link.click()
      
      // Cleanup
      URL.revokeObjectURL(url)
      
      toast.dismiss()
      toast.success(`Downloaded ${completedResults.length} images as ZIP`)
    } catch (error) {
      console.error("Error creating ZIP:", error)
      toast.error("Failed to create ZIP file")
    }
  }

  if (userPlan.toLowerCase() === "free") {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="max-w-md">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Upgrade Required</CardTitle>
            <CardDescription>
              Batch processing is available for Pro and Enterprise plans
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>With batch processing, you can:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Process up to 50 images at once</li>
                <li>Save time with parallel processing</li>
                <li>Download all results together</li>
                <li>Perfect for bulk product photos</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <Button asChild className="flex-1">
                <Link href="/dashboard/billing">
                  Upgrade Now
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/remove-background">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Batch Background Removal</h1>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              {userPlan.toLowerCase() === "enterprise" ? "Enterprise" : "Pro"}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Process up to {maxBatchSize} images at once
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/remove-background">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Single Image
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upload Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload Images</CardTitle>
              <CardDescription>
                Select multiple images for batch processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BatchUpload
                onBatchUpload={handleBatchUpload}
                isProcessing={isProcessing}
                maxSize={maxFileSize}
                maxFiles={maxBatchSize}
              />
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="h-5 w-5 text-primary" />
                Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Consistent Lighting</p>
                    <p className="text-muted-foreground">
                      Use similar lighting across all images for best results
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    2
                  </div>
                  <div>
                    <p className="font-medium">High Resolution</p>
                    <p className="text-muted-foreground">
                      Higher quality inputs produce better outputs
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Organize First</p>
                    <p className="text-muted-foreground">
                      Name your files clearly before uploading
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span>Parallel processing</span>
              </div>
              <div className="flex items-center gap-2">
                <ImageMinus className="h-4 w-4 text-primary" />
                <span>Batch download</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Priority queue</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results Section */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Processing Status</CardTitle>
                <CardDescription>
                  {results.filter(r => r.status === "complete").length} of {results.length} images completed
                </CardDescription>
              </div>
              <Button 
                onClick={downloadAll} 
                disabled={results.filter(r => r.status === "complete").length === 0 || isProcessing}
              >
                <Download className="mr-2 h-4 w-4" />
                Download ZIP
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {Math.round((results.filter(r => r.status !== "processing").length / results.length) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={(results.filter(r => r.status !== "processing").length / results.length) * 100} 
                  className="h-2"
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {results.map((result, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="shrink-0">
                        {result.status === "complete" && (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                        {result.status === "error" && (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )}
                        {result.status === "processing" && (
                          <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{result.fileName}</p>
                        {result.error && (
                          <p className="text-xs text-destructive truncate">{result.error}</p>
                        )}
                      </div>
                    </div>
                    <Badge 
                      variant={result.status === "complete" ? "default" : result.status === "error" ? "destructive" : "secondary"}
                      className="shrink-0 ml-2"
                    >
                      {result.status === "complete" ? "Done" : result.status === "error" ? "Failed" : "Processing..."}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
