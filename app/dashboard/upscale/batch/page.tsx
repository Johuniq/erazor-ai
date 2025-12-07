"use client"

import { BatchUpload } from "@/components/dashboard/batch-upload"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useUserStore } from "@/lib/store/user-store"
import { createClient } from "@/lib/supabase/client"
import { getFileSizeLimit } from "@/lib/utils"
import { ArrowLeft, Crown, Download, Lightbulb, Lock, Maximize2, Sparkles, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface BatchResult {
  originalUrl: string
  resultUrl: string
  fileName: string
  status: "complete" | "error"
  error?: string
}

export default function BatchUpscalePage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<BatchResult[]>([])
  const [userPlan, setUserPlan] = useState<string>("free")
  const { deductCredits } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    async function checkPlanAccess() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("plan")
          .eq("id", user.id)
          .single()
        
        if (profile?.plan) {
          setUserPlan(profile.plan)
          // Redirect if not pro or enterprise
          if (profile.plan === "free") {
            toast.error("Batch processing requires Pro or Enterprise plan")
            router.push("/dashboard/billing")
          }
        }
      }
    }
    checkPlanAccess()
  }, [router])

  const maxFileSize = getFileSizeLimit(userPlan)
  const maxBatchSize = userPlan === "enterprise" ? 50 : 25

  const handleBatchUpload = async (files: File[]) => {
    setIsProcessing(true)
    const newResults: BatchResult[] = []

    try {
      // Process files in parallel batches of 5
      const batchSize = 5
      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize)
        
        const promises = batch.map(async (file) => {
          try {
            const formData = new FormData()
            formData.append("image", file)
            formData.append("type", "upscale")

            const response = await fetch("/api/process", {
              method: "POST",
              body: formData,
            })

            if (!response.ok) {
              const errorData = await response.json()
              throw new Error(errorData.message || "Processing failed")
            }

            const data = await response.json()

            // Deduct credit
            await deductCredits(1)

            return {
              originalUrl: URL.createObjectURL(file),
              resultUrl: data.resultUrl,
              fileName: file.name,
              status: "complete" as const,
            }
          } catch (error) {
            console.error(`Error processing ${file.name}:`, error)
            return {
              originalUrl: URL.createObjectURL(file),
              resultUrl: "",
              fileName: file.name,
              status: "error" as const,
              error: error instanceof Error ? error.message : "Processing failed",
            }
          }
        })

        const batchResults = await Promise.all(promises)
        newResults.push(...batchResults)
        setResults([...newResults])

        // Show progress toast
        toast.success(`Processed ${newResults.length} of ${files.length} images`)
      }

      toast.success(`Batch processing complete! ${newResults.filter(r => r.status === "complete").length} images processed`)
    } catch (error) {
      console.error("Batch processing error:", error)
      toast.error("Batch processing failed")
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadAll = () => {
    results.forEach((result) => {
      if (result.status === "complete") {
        const link = document.createElement("a")
        link.href = result.resultUrl
        link.download = `upscaled-${result.fileName}`
        link.click()
      }
    })
    toast.success("Downloading all processed images")
  }

  if (userPlan === "free") {
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
                <li>Upscale to 4K quality in bulk</li>
                <li>Download all results together</li>
                <li>Save hours of manual work</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <Button asChild className="flex-1">
                <Link href="/dashboard/billing">
                  Upgrade Now
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/upscale">
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
            <h1 className="text-3xl font-bold tracking-tight">Batch Image Upscaling</h1>
            <Badge variant="secondary" className="gap-1">
              <Crown className="h-3 w-3" />
              {userPlan === "enterprise" ? "Enterprise" : "Pro"}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Upscale up to {maxBatchSize} images to 4K quality
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/upscale">
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
                Select multiple images for batch upscaling
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
                Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Best Quality</p>
                    <p className="text-muted-foreground">
                      Works best with clean, high-quality original images
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Similar Types</p>
                    <p className="text-muted-foreground">
                      Group similar images together for consistent results
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    3
                  </div>
                  <div>
                    <p className="font-medium">4K Output</p>
                    <p className="text-muted-foreground">
                      All images upscaled to stunning 4K resolution
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
                <Maximize2 className="h-4 w-4 text-primary" />
                <span>4K upscaling</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>AI enhancement</span>
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
                <CardTitle>Results</CardTitle>
                <CardDescription>
                  {results.filter(r => r.status === "complete").length} of {results.length} images upscaled
                </CardDescription>
              </div>
              <Button onClick={downloadAll} disabled={results.filter(r => r.status === "complete").length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Download All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.map((result, index) => (
                  <div key={index} className="space-y-2">
                    <div className="relative aspect-square rounded-lg border overflow-hidden bg-muted">
                      {result.status === "complete" ? (
                        <Image
                          src={result.resultUrl}
                          alt={result.fileName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-destructive text-xs p-2 text-center">
                          {result.error || "Failed"}
                        </div>
                      )}
                    </div>
                    <p className="text-xs truncate">{result.fileName}</p>
                    {result.status === "complete" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        asChild
                      >
                        <a href={result.resultUrl} download={`upscaled-${result.fileName}`}>
                          <Download className="mr-2 h-3 w-3" />
                          Download
                        </a>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
