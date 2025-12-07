import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ImageProcessor } from "@/components/public-tool/image-processor";
import { createClient } from "@/lib/supabase/server";
import { CheckCircle2, Maximize2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Image Upscaler - Upscale Images Online with AI | Erazor AI",
  description:
    "Upscale images up to 4x with AI. Increase image resolution while preserving quality. Free to try, no signup required. Perfect for enlarging photos, artwork, and product images.",
  keywords: [
    "image upscaler",
    "upscale image",
    "AI image upscaler",
    "increase image resolution",
    "enlarge image",
    "image enhancer",
    "photo enhancer",
    "AI upscaling",
    "free image upscaler",
    "online image upscaler",
    "4x upscale",
    "image resolution enhancer",
    "photo upscaler",
  ],
  openGraph: {
    title: "Free Image Upscaler - Upscale Images Online with AI",
    description:
      "Upscale images up to 4x with AI. Increase resolution while preserving quality. Free to try, no signup required.",
    url: "https://www.erazor.app/tools/upscale",
    siteName: "Erazor AI",
    images: [
      {
        url: "https://www.erazor.app/og-upscaler.jpg",
        width: 1200,
        height: 630,
        alt: "Erazor AI Image Upscaler - Before and After",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Image Upscaler - Upscale Images Online with AI",
    description:
      "Upscale images up to 4x with AI. Free to try, no signup required.",
    images: ["https://www.erazor.app/og-upscaler.jpg"],
  },
  alternates: {
    canonical: "https://www.erazor.app/tools/upscale",
  },
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much can I upscale an image?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can upscale images up to 4x their original resolution. For example, a 500x500 image can become 2000x2000 pixels.",
      },
    },
    {
      "@type": "Question",
      name: "Will upscaling make my image blurry?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No! Unlike traditional upscaling that just stretches pixels, our AI intelligently adds detail to create natural-looking high-resolution images without blur or artifacts.",
      },
    },
    {
      "@type": "Question",
      name: "What types of images work best with AI upscaling?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our AI works great with photos, illustrations, artwork, product images, and more. It's especially effective for enlarging portraits and product photography.",
      },
    },
  ],
};

const howToStructuredData = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Upscale an Image with AI",
  description: "Increase image resolution up to 4x using AI upscaling",
  step: [
    {
      "@type": "HowToStep",
      name: "Upload Image",
      text: "Click or drag and drop your image into the upload area",
    },
    {
      "@type": "HowToStep",
      name: "AI Enhancement",
      text: "Our AI analyzes and intelligently upscales your image",
    },
    {
      "@type": "HowToStep",
      name: "Download Result",
      text: "Download your enhanced high-resolution image",
    },
  ],
  totalTime: "PT60S",
  tool: {
    "@type": "HowToTool",
    name: "Erazor AI Image Upscaler",
  },
};

const breadcrumbStructuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.erazor.app",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Tools",
      item: "https://www.erazor.app/tools",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Image Upscaler",
      item: "https://www.erazor.app/tools/upscale",
    },
  ],
};

export default async function UpscalePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch user profile if authenticated
  let userProfile = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();
    userProfile = profile;
  }

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      <Header isLoggedIn={!!user} userEmail={user?.email} />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16 lg:px-8">
          {/* Header */}
          <div className="mb-8 sm:mb-10 text-center">
            <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-primary/10">
              <Maximize2 className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight lg:text-4xl">
              Upscale Image with AI
            </h1>
            <p className="mx-auto mt-2 sm:mt-3 max-w-xl text-base sm:text-lg text-muted-foreground">
              Enhance image resolution up to 4x while preserving quality. AI
              adds natural detail for stunning results.
            </p>
          </div>

          {/* Tool */}
          <ImageProcessor
            type="upscale"
            title="Image Upscaling"
            description="Upload an image to enhance its resolution"
            isAuthenticated={!!user}
            userCredits={userProfile?.credits}
          />

          {/* Features */}
          <div className="mt-8 sm:mt-12 lg:mt-16 grid gap-4 sm:gap-6 sm:grid-cols-3">
            {[
              {
                title: "Up to 4x Upscale",
                description:
                  "Dramatically increase resolution without losing quality",
              },
              {
                title: "AI Enhancement",
                description:
                  "Intelligent detail enhancement for natural results",
              },
              {
                title: "Any Image Type",
                description: "Works great with photos, illustrations, and more",
              },
            ].map((feature) => (
              <div key={feature.title} className="flex items-start gap-2 sm:gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm sm:text-base font-medium">{feature.title}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 sm:mt-16">
            <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6 sm:mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4 sm:space-y-6">
              <div className="rounded-lg border border-border p-4 sm:p-6">
                <h3 className="text-sm sm:text-base font-semibold">
                  How much can I upscale an image?
                </h3>
                <p className="mt-2 text-xs sm:text-sm lg:text-base text-muted-foreground">
                  You can upscale images up to 4x their original resolution. For
                  example, a 500x500 image can become 2000x2000 pixels.
                </p>
              </div>
              <div className="rounded-lg border border-border p-4 sm:p-6">
                <h3 className="text-sm sm:text-base font-semibold">
                  Will upscaling make my image blurry?
                </h3>
                <p className="mt-2 text-xs sm:text-sm lg:text-base text-muted-foreground">
                  No! Unlike traditional upscaling that just stretches pixels,
                  our AI intelligently adds detail to create natural-looking
                  high-resolution images without blur or artifacts.
                </p>
              </div>
              <div className="rounded-lg border border-border p-4 sm:p-6">
                <h3 className="text-sm sm:text-base font-semibold">
                  What types of images work best with AI upscaling?
                </h3>
                <p className="mt-2 text-xs sm:text-sm lg:text-base text-muted-foreground">
                  Our AI works great with photos, illustrations, artwork,
                  product images, and more. It's especially effective for
                  enlarging portraits and product photography.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 sm:mt-16 rounded-xl border border-border bg-muted/30 p-6 sm:p-8 text-center">
            <h2 className="text-lg sm:text-xl font-semibold">Need more credits?</h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Sign up for free to get 10 credits, or upgrade to Pro for 200
              credits/month.
            </p>
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
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
