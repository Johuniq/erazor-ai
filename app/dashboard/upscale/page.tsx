"use client"

import { ImageProcessor } from "@/components/image-processing/image-processor"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUserStore } from "@/lib/store/user-store"
import { Crown, ImageIcon, Layers, Lightbulb, Maximize2 } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

export default function UpscalePage() {
  const { profile, fetchProfile } = useUserStore()

  // Fetch profile if not loaded
  useEffect(() => {
    if (!profile) {
      fetchProfile()
    }
  }, [profile, fetchProfile])

  const userPlan = profile?.plan || "free"
  const userCredits = profile?.credits || 0

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 space-y-6 sm:space-y-8">
      {/* Page header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-primary/10 shadow-sm">
              <Maximize2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Image Upscaling</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Enhance your images to higher resolution with AI</p>
            </div>
          </div>
          {(userPlan.toLowerCase() === "pro" || userPlan.toLowerCase() === "enterprise") && (
            <Button asChild variant="outline" size="sm" className="gap-2 shrink-0">
              <Link href="/dashboard/upscale/batch">
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
          <CardDescription className="text-xs sm:text-sm">Our AI will upscale your image up to 2x resolution</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <ImageProcessor
            type="upscale"
            title="Image Upscaling"
            description="Enhance your images to higher resolution with AI"
            isAuthenticated={true}
            userCredits={userCredits}
          />
        </CardContent>
      </Card>

      {/* Tips section */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        {[
          {
            icon: Lightbulb,
            title: "Best Quality",
            description: "Start with the highest quality image you have",
          },
          {
            icon: ImageIcon,
            title: "Works Best",
            description: "Photos and artwork produce the best results",
          },
          {
            icon: Crown,
            title: "Pro Feature",
            description: "Pro users can upscale up to 4x resolution",
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
