import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ImageMinus, Sparkles, Wand2, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Image Editing Tools - Remove Background & Upscale Images | Erazor AI",
  description:
    "Discover all our free AI-powered image editing tools. Remove backgrounds, upscale images, and enhance photos online. Professional quality, instant results, no signup required.",
  keywords: [
    "ai image editing tools",
    "online image editor",
    "free image tools",
    "background remover tool",
    "image upscaler tool",
    "ai photo editing",
    "image enhancement tools",
    "professional image editing",
    "batch image processing",
    "ai image toolkit",
    "online photo editor",
    "image editing suite",
    "free photo tools",
    "ai powered image tools",
    "image processing tools"
  ],
  openGraph: {
    title: "AI Image Editing Tools - All Features | Erazor AI",
    description:
      "Explore our complete suite of AI image editing tools. Remove backgrounds, upscale images, and more.",
    url: "https://www.erazor.app/tools",
    siteName: "Erazor AI",
    images: [
      {
        url: "https://www.erazor.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Erazor AI Tools",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Image Editing Tools - All Features | Erazor AI",
    description:
      "Explore our complete suite of AI image editing tools. Free, fast, and professional quality.",
  },
  alternates: {
    canonical: "https://www.erazor.app/tools",
  },
};

const tools = [
  {
    title: "AI Background Remover",
    description: "Remove backgrounds from images in 5 seconds with AI. Perfect for product photos, portraits, and ecommerce.",
    icon: ImageMinus,
    href: "/tools/remove-background",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    features: [
      "Instant background removal",
      "No manual editing required",
      "100% automatic AI detection",
      "Download as PNG with transparency"
    ],
    badge: "Most Popular",
    badgeColor: "bg-blue-500"
  },
  {
    title: "AI Image Upscaler",
    description: "Upscale and enhance images up to 4x resolution without losing quality. Perfect for prints and high-res displays.",
    icon: Sparkles,
    href: "/tools/upscale",
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950",
    features: [
      "Enhance up to 4x resolution",
      "AI-powered quality improvement",
      "No quality loss",
      "Perfect for prints & posters"
    ],
    badge: "Pro Feature",
    badgeColor: "bg-purple-500"
  },
  {
    title: "Batch Processing",
    description: "Process multiple images at once. Remove backgrounds or upscale in bulk to save time.",
    icon: Zap,
    href: "/dashboard",
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950",
    features: [
      "Process up to 50 images at once",
      "Automatic queue management",
      "Download all as ZIP",
      "Time-saving automation"
    ],
    badge: "Coming Soon",
    badgeColor: "bg-green-500"
  },
  {
    title: "Background Addition",
    description: "Add custom backgrounds or choose from our gradient library after removing backgrounds.",
    icon: Wand2,
    href: "/tools/remove-background",
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-950",
    features: [
      "6 gradient presets included",
      "Upload custom backgrounds",
      "Real-time preview",
      "High-quality compositing"
    ],
    badge: "New",
    badgeColor: "bg-orange-500"
  }
];

const stats = [
  { label: "Images Processed", value: "10M+" },
  { label: "Happy Users", value: "500K+" },
  { label: "Countries", value: "180+" },
  { label: "Avg. Processing Time", value: "5s" }
];

export default function ToolsPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background to-muted/20 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4" variant="secondary">
              All Tools
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              AI Image Editing Tools
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Professional AI-powered image editing tools. Remove backgrounds, upscale images, and enhance photos in seconds. 
              <span className="font-semibold text-foreground"> Free to use, no signup required.</span>
            </p>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-lg border bg-background p-4">
                  <div className="text-2xl font-bold sm:text-3xl">{stat.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Choose Your Tool
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Select from our suite of AI-powered image editing tools
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Card key={tool.title} className="group relative overflow-hidden transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`rounded-xl ${tool.bgColor} p-3`}>
                        <Icon className={`h-6 w-6 ${tool.color}`} />
                      </div>
                      {tool.badge && (
                        <Badge className={`${tool.badgeColor} text-white`}>
                          {tool.badge}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="mt-4 text-2xl">{tool.title}</CardTitle>
                    <CardDescription className="text-base">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="mb-6 space-y-2">
                      {tool.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="w-full group-hover:gap-3" variant="default">
                      <Link href={tool.href}>
                        Try Now
                        <ArrowRight className="ml-2 h-4 w-4 transition-all" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/20 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why Choose Erazor AI Tools?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Professional quality meets simplicity
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-background p-6">
              <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
                <Zap className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Process images in seconds with our optimized AI models. No waiting, instant results.
              </p>
            </div>

            <div className="rounded-lg border bg-background p-6">
              <div className="mb-4 inline-flex rounded-lg bg-purple-50 p-3 dark:bg-purple-950">
                <Sparkles className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">AI-Powered Quality</h3>
              <p className="text-muted-foreground">
                State-of-the-art AI technology ensures professional-grade results every time.
              </p>
            </div>

            <div className="rounded-lg border bg-background p-6">
              <div className="mb-4 inline-flex rounded-lg bg-green-50 p-3 dark:bg-green-950">
                <ImageMinus className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">No Learning Curve</h3>
              <p className="text-muted-foreground">
                Upload, process, download. Simple 3-step workflow anyone can master in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Transform Your Images?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start editing with AI-powered tools. No signup required for your first 3 images.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link href="/tools/remove-background">
                <ImageMinus className="h-5 w-5" />
                Remove Background
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link href="/tools/upscale">
                <Sparkles className="h-5 w-5" />
                Upscale Image
              </Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Join 500,000+ users editing images with Erazor AI
          </p>
        </div>
      </section>
    </main>
  );
}
