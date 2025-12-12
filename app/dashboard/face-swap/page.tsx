"use client"

import { FaceSwapper } from "@/components/image-processing/face-swapper"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUserStore } from "@/lib/store/user-store"
import { Lightbulb, Shield, Users, Zap } from "lucide-react"
import { useEffect } from "react"

export default function FaceSwapPage() {
  const { profile, fetchProfile } = useUserStore()

  // Fetch profile if not loaded
  useEffect(() => {
    if (!profile) {
      fetchProfile()
    }
  }, [profile, fetchProfile])

  const userCredits = profile?.credits || 0

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 space-y-6 sm:space-y-8">
      {/* Page header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-primary/10 shadow-sm">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Face Swap</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Swap faces between two photos with AI precision</p>
          </div>
        </div>
      </div>

      {/* Main card */}
      <Card className="shadow-sm border-border/60">
        <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg">Upload Your Images</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Upload target image and source face to swap</CardDescription>
            </div>
            <Badge variant="secondary" className="text-xs">2 Credits per swap</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <FaceSwapper
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
            title: "Clear Faces",
            description: "Use images with clear, front-facing faces for best results",
          },
          {
            icon: Zap,
            title: "Good Lighting",
            description: "Well-lit photos produce more natural face swaps",
          },
          {
            icon: Shield,
            title: "High Quality",
            description: "Higher resolution images yield better quality results",
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

      {/* Info banner */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="text-sm sm:text-base font-medium">How Face Swap Works</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Our AI automatically detects faces in both images, extracts facial features and landmarks, 
                then seamlessly blends the source face onto the target image with natural alignment and color matching.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
