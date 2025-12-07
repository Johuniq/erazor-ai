"use client"

import { ImageUpload } from "@/components/dashboard/image-upload"
import { ProcessingResult } from "@/components/dashboard/processing-result"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUserStore } from "@/lib/store/user-store"
import { createClient } from "@/lib/supabase/client"
import { getFileSizeLimit } from "@/lib/utils"
import { ImageIcon, ImageMinus, Layers, Lightbulb, Sparkles, Zap } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type ProcessingState = "idle" | "uploading" | "processing" | "complete" | "error"

export default function BackgroundRemovalPage() {
  const [state, setState] = useState<ProcessingState>("idle")
  const [originalUrl, setOriginalUrl] = useState<string>("")
  const [resultUrl, setResultUrl] = useState<string>("")
  const [userPlan, setUserPlan] = useState<string>("free")
  const { deductCredits } = useUserStore()

  useEffect(() => {
    async function fetchUserPlan() {
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
        }
      }
    }
    fetchUserPlan()
  }, [])

  const maxFileSize = getFileSizeLimit(userPlan)

  const handleUpload = async (file: File) => {
    setState("uploading")

    try {
      const formData = new FormData()
      formData.append("image", file)
      formData.append("type", "bg_removal")

      const response = await fetch("/api/process", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Processing failed")
      }

      setState("processing")

      const data = await response.json()
      setOriginalUrl(URL.createObjectURL(file))

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

      const result = await pollResult(data.job_id)
      setResultUrl(result)
      setState("complete")
      
      // Deduct credits from store
      deductCredits(1)
      
      toast.success("Background removed successfully!")
    } catch (error) {
      setState("error")
      toast.error(error instanceof Error ? error.message : "Processing failed")
    }
  }

  const handleReset = () => {
    setState("idle")
    setOriginalUrl("")
    setResultUrl("")
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 space-y-6 sm:space-y-8">
      {/* Page header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-primary/10 shadow-sm">
              <ImageMinus className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Background Removal</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Remove backgrounds from your images with AI precision</p>
            </div>
          </div>
          {(userPlan === "pro" || userPlan === "enterprise") && (
            <Button asChild variant="outline" size="sm" className="gap-2 shrink-0">
              <Link href="/dashboard/remove-background/batch">
                <Layers className="h-4 w-4" />
                <span className="hidden sm:inline">Batch Processing</span>
                <span className="sm:hidden">Batch</span>
                <Badge variant="secondary" className="ml-1">Pro</Badge>
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Main card */}
      <Card className="shadow-sm border-border/60">
        <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Upload Your Image</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Our AI will automatically detect and remove the background</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {state === "complete" ? (
            <ProcessingResult originalUrl={originalUrl} resultUrl={resultUrl} onReset={handleReset} />
          ) : (
            <div className="space-y-3 sm:space-y-4">
              <ImageUpload onUpload={handleUpload} isProcessing={state === "uploading" || state === "processing"} maxSize={maxFileSize} />
              {(state === "uploading" || state === "processing") && (
                <div className="flex items-center justify-center gap-2 sm:gap-3 rounded-xl bg-primary/5 border border-primary/20 p-4 sm:p-5">
                  <div className="relative shrink-0">
                    <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary/20">
                      <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary animate-pulse" />
                    </div>
                    <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-medium">
                      {state === "uploading" ? "Uploading your image..." : "AI is processing your image..."}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">This usually takes 5-10 seconds</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips section - Enhanced */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        {[
          {
            icon: Lightbulb,
            title: "Good Lighting",
            description: "Use images with clear subjects and good lighting",
          },
          {
            icon: ImageIcon,
            title: "High Resolution",
            description: "Higher resolution images produce better results",
          },
          {
            icon: Zap,
            title: "Best For",
            description: "Works best with photos of people, products, and objects",
          },
        ].map((tip) => (
          <Card key={tip.title} className="border-dashed border-border/60">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <tip.icon className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{tip.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{tip.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
