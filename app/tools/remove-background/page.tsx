import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ImageProcessor } from "@/components/public-tool/image-processor";
import { createClient } from "@/lib/supabase/server";
import { CheckCircle2, ImageMinus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Background Remover - Remove Image Background Online | Erazor AI",
  description:
    "Remove backgrounds from images instantly with AI. 100% automatic, free to try, no signup required. Perfect for product photos, portraits, logos, and more. Results in seconds.",
  keywords: [
    "remove background",
    "background remover",
    "remove background from image",
    "free background remover",
    "online background remover",
    "transparent background",
    "remove bg",
    "background eraser",
    "photo background remover",
    "product photo background removal",
    "AI background removal",
    "automatic background removal",
  ],
  openGraph: {
    title: "Free Background Remover - Remove Image Background Online",
    description:
      "Remove backgrounds from images instantly with AI. 100% automatic, free to try, no signup required. Results in seconds.",
    url: "https://www.erazor.app/tools/remove-background",
    siteName: "Erazor AI",
    images: [
      {
        url: "https://www.erazor.app/og-bg-remover.jpg",
        width: 1200,
        height: 630,
        alt: "Erazor AI Background Remover - Before and After",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Background Remover - Remove Image Background Online",
    description:
      "Remove backgrounds from images instantly with AI. Free to try, no signup required.",
    images: ["https://www.erazor.app/og-bg-remover.jpg"],
  },
  alternates: {
    canonical: "https://www.erazor.app/tools/remove-background",
  },
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is the background remover free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! You can remove backgrounds from 3 images for free without signing up. Sign up for a free account to get 10 credits, or upgrade to Pro for 200 credits per month.",
      },
    },
    {
      "@type": "Question",
      name: "How does AI background removal work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our AI analyzes your image to identify the subject and background. It then precisely removes the background while preserving fine details like hair, fur, and transparent objects, delivering a clean transparent PNG.",
      },
    },
    {
      "@type": "Question",
      name: "What image formats are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We support JPG, PNG, and WebP formats. The output is always a high-quality PNG with transparency.",
      },
    },
  ],
};

const howToStructuredData = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Remove Background from Image",
  description: "Remove backgrounds from images instantly using AI",
  step: [
    {
      "@type": "HowToStep",
      name: "Upload Image",
      text: "Click or drag and drop your image into the upload area",
    },
    {
      "@type": "HowToStep",
      name: "AI Processing",
      text: "Our AI automatically detects and removes the background",
    },
    {
      "@type": "HowToStep",
      name: "Download Result",
      text: "Download your image with transparent background as PNG",
    },
  ],
  totalTime: "PT30S",
  tool: {
    "@type": "HowToTool",
    name: "Erazor AI Background Remover",
  },
};

export default async function RemoveBackgroundPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToStructuredData),
        }}
      />
      <Header isLoggedIn={!!user} />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <ImageMinus className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Remove Background from Image
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-lg text-muted-foreground">
              Instantly remove backgrounds from any image with AI-powered
              precision. Free to try, no signup required.
            </p>
          </div>

          {/* Tool */}
          <ImageProcessor
            type="bg_removal"
            title="Background Removal"
            description="Upload an image to remove its background"
          />

          {/* Features */}
          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "AI-Powered",
                description:
                  "Advanced AI handles complex edges and fine details",
              },
              {
                title: "Lightning Fast",
                description: "Results in under 5 seconds",
              },
              {
                title: "High Quality",
                description: "PNG export with full transparency",
              },
            ].map((feature) => (
              <div key={feature.title} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="rounded-lg border border-border p-6">
                <h3 className="font-semibold">
                  Is the background remover free to use?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Yes! You can remove backgrounds from 3 images for free without
                  signing up. Sign up for a free account to get 10 credits, or
                  upgrade to Pro for 200 credits per month.
                </p>
              </div>
              <div className="rounded-lg border border-border p-6">
                <h3 className="font-semibold">
                  How does AI background removal work?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Our AI analyzes your image to identify the subject and
                  background. It then precisely removes the background while
                  preserving fine details like hair, fur, and transparent
                  objects, delivering a clean transparent PNG.
                </p>
              </div>
              <div className="rounded-lg border border-border p-6">
                <h3 className="font-semibold">
                  What image formats are supported?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  We support JPG, PNG, and WebP formats. The output is always a
                  high-quality PNG with transparency.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-xl border border-border bg-muted/30 p-8 text-center">
            <h2 className="text-xl font-semibold">Need more credits?</h2>
            <p className="mt-2 text-muted-foreground">
              Sign up for free to get 10 credits, or upgrade to Pro for 200
              credits/month.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Sign Up Free
              </Link>
              <Link
                href="/#pricing"
                className="inline-flex items-center justify-center rounded-md border border-border px-6 py-2.5 text-sm font-medium hover:bg-muted"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
