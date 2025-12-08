"use client"

import { ImageProcessor } from "@/components/image-processing/image-processor"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUserStore } from "@/lib/store/user-store"
import { ImageIcon, ImageMinus, Layers, Lightbulb, Zap } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

export default function BackgroundRemovalPage() {
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
              <ImageMinus className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Background Removal</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Remove backgrounds from your images with AI precision</p>
            </div>
          </div>
          {(userPlan.toLowerCase() === "pro" || userPlan.toLowerCase() === "enterprise") && (
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
          <ImageProcessor
            type="bg_removal"
            title="Background Removal"
            description="Remove backgrounds from your images with AI precision"
            isAuthenticated={true}
            userCredits={userCredits}
            userPlan={userPlan}
          />
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
