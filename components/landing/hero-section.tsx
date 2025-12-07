"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CDN_URL } from "@/constants/data"
import { CheckCircle2, ImageMinus, Maximize2, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function HeroSection() {

  return (
    <section className="relative overflow-hidden pt-20 pb-20 sm:pt-28 sm:pb-28">
      {/* Animated background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.95_0.005_265)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.95_0.005_265)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <div className="absolute right-0 top-0 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute left-0 bottom-0 -z-10 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* ProductHunt Badge */}
          <div className="w-full flex items-center justify-center mb-2">
            <a href="https://fazier.com/launches/www.erazor.app" target="_blank"><img src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=featured&theme=light" width={200} height={50} alt="Fazier badge" /></a>
          </div>

          <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Professional AI
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Image Editor
            </span>
            <br />
            Remove backgrounds & upscale images
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-pretty sm:text-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Advanced AI-powered image editing suite. Remove backgrounds, upscale images up to 4x, and enhance photos instantly. No signup required to try. Perfect for designers, marketers, and e-commerce sellers.
          </p>

          {/* Trust indicators */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />3 free credits instantly
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Results in 5 seconds
            </span>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400 relative z-10">
            <Button
              size="lg"
              asChild
              className="h-13 gap-2 px-8 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
            >
              <Link href="/tools/remove-background">
                <ImageMinus className="h-5 w-5" />
                Remove Background Free
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-13 gap-2 px-8 text-base bg-transparent">
              <Link href="/tools/upscale">
                <Maximize2 className="h-5 w-5" />
                Upscale Image Free
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          {[
            { value: "10M+", label: "Images processed" },
            { value: "50K+", label: "Happy users" },
            { value: "< 5s", label: "Processing time" },
            { value: "99.9%", label: "Uptime" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border/50 bg-card/50 p-4 text-center backdrop-blur-sm"
            >
              <div className="text-2xl font-bold text-foreground sm:text-3xl">{stat.value}</div>
              <div className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Interactive Demo Preview */}
        <div className="relative mx-auto mt-16 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/5">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <div className="ml-4 flex-1 rounded-md bg-background px-3 py-1 text-xs text-muted-foreground">
                erazor.app/tools/remove-background
              </div>
            </div>

            {/* Demo content */}
            <div className="relative aspect-[16/9] bg-muted/30">
              <div className="absolute inset-0 grid grid-cols-2">
                {/* Before */}
                <div className="relative flex items-center justify-center border-r border-dashed border-border/50">
                  <div className="text-center p-8">
                    <div className="relative mx-auto h-32 w-32 sm:h-48 sm:w-48">
                      <Image
                        src={`${CDN_URL}/assets/social-2.jpg`}
                        width={500}
                        height={500}
                        alt="Original image with background"
                        className="h-full w-full rounded-xl object-cover shadow-lg"
                      />
                    </div>
                    <Badge variant="secondary" className="mt-4 text-xs">
                      Original
                    </Badge>
                  </div>
                </div>
                {/* After */}
                <div className="relative flex items-center justify-center bg-[repeating-conic-gradient(oklch(0.96_0.005_265)_0%_25%,oklch(0.99_0_0)_0%_50%)] bg-[length:16px_16px]">
                  <div className="text-center p-8">
                    <div className="relative mx-auto h-32 w-32 sm:h-48 sm:w-48">
                      <Image
                        src={`${CDN_URL}/assets/social-2-removed.png`}
                        alt="Image with background removed"
                        height={500}
                        width={500}
                        className="h-full w-full rounded-xl object-cover shadow-lg"
                      />
                    </div>
                    <Badge className="mt-4 text-xs">Background Removed</Badge>
                  </div>
                </div>
              </div>

              {/* Center AI badge */}
              <div className="absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-background bg-primary shadow-xl">
                <Sparkles className="h-7 w-7 text-primary-foreground" />
              </div>

              {/* Play demo button overlay */}
              {/* {!showDemo && (
                <button
                  onClick={() => setShowDemo(true)}
                  className="absolute inset-0 flex items-center justify-center bg-foreground/5 opacity-0 transition-opacity hover:opacity-100"
                >
                  <div className="flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background shadow-lg">
                    <Play className="h-4 w-4" />
                    Watch Demo
                  </div>
                </button>
              )} */}
            </div>
          </div>

          {/* Floating elements */}
          <div className="absolute -left-4 top-1/4 hidden rounded-lg border border-border bg-card p-3 shadow-lg lg:block">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-xs">
                <p className="font-medium">Processing Complete</p>
                <p className="text-muted-foreground">2.3 seconds</p>
              </div>
            </div>
          </div>

          <div className="absolute -right-4 bottom-1/4 hidden rounded-lg border border-border bg-card p-3 shadow-lg lg:block">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div className="text-xs">
                <p className="font-medium">AI Quality Score</p>
                <p className="text-primary font-semibold">98%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
