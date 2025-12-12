import { FaceSwapper } from "@/components/image-processing/face-swapper";
import { createClient } from "@/lib/supabase/server";
import { CheckCircle2, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does AI face swapping work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our AI detects faces in both images, extracts facial features and landmarks, then seamlessly blends the source face onto the target image with natural alignment and color matching. The process takes 30-60 seconds.",
      },
    },
    {
      "@type": "Question",
      name: "Is face swapping free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can try face swapping for free (2 credits per swap). Sign up for a free account to get 10 credits, or upgrade to Pro for 200 credits per month.",
      },
    },
    {
      "@type": "Question",
      name: "What types of images work best for face swapping?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use clear, front-facing photos with good lighting. Both images should have clearly visible faces. Higher resolution images produce better quality results.",
      },
    },
  ],
};

const howToStructuredData = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Swap Faces in Photos",
  description: "Swap faces between two images using AI",
  step: [
    {
      "@type": "HowToStep",
      name: "Upload Target Image",
      text: "Upload the photo where you want to replace the face",
    },
    {
      "@type": "HowToStep",
      name: "Upload Source Face",
      text: "Upload the image containing the face you want to use",
    },
    {
      "@type": "HowToStep",
      name: "AI Processing",
      text: "Our AI detects faces and performs the swap with natural blending",
    },
    {
      "@type": "HowToStep",
      name: "Download Result",
      text: "Review and download your face-swapped image",
    },
  ],
  totalTime: "PT60S",
  tool: {
    "@type": "HowToTool",
    name: "Erazor AI Face Swapper",
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
      name: "Face Swapper",
      item: "https://www.erazor.app/tools/face-swap",
    },
  ],
};

export const metadata: Metadata = {
  title: "AI Face Swapper - Swap Faces Online Free | Erazor AI",
  description:
    "Swap faces between photos with AI. Upload two images and automatically swap faces in seconds. Perfect for fun photos, creative projects, and entertainment. Free face swap tool online.",
  keywords: [
    "face swap",
    "face swapper online",
    "ai face swap",
    "swap faces online free",
    "face swap app",
    "face changer",
    "face replacement",
    "swap faces in photos",
    "deepfake face swap",
    "face swap tool",
    "online face swapper",
    "face swap ai",
    "automatic face swap",
    "face morphing",
    "face transplant",
    "face swap free",
    "swap faces automatically",
    "ai face changer",
    "photo face swap",
    "face swap generator"
  ],
  openGraph: {
    title: "AI Face Swapper - Swap Faces Online Free",
    description:
      "Swap faces between photos instantly with AI. Upload two images and swap faces automatically. Free face swap tool.",
    url: "https://www.erazor.app/tools/face-swap",
    siteName: "Erazor AI",
    images: [
      {
        url: "https://www.erazor.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Erazor AI Face Swapper",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Face Swapper - Swap Faces Online Free",
    description:
      "Swap faces between photos instantly with AI. Free face swap tool online.",
    images: ["https://www.erazor.app/og-image.jpg"],
  },
  alternates: {
    canonical: "https://www.erazor.app/tools/face-swap",
  },
};

export default async function FaceSwapPage() {
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
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16 lg:px-8">
          {/* Header */}
          <div className="mb-8 sm:mb-10 text-center">
            <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight lg:text-4xl">
              AI Face Swapper - Swap Faces Online Free
            </h1>
            <p className="mx-auto mt-2 sm:mt-3 max-w-2xl text-base sm:text-lg text-muted-foreground">
              Swap faces between photos with AI. Upload two images and automatically swap faces in seconds. Perfect for fun photos & creative projects.
            </p>
          </div>

          {/* Tool */}
          <FaceSwapper
            isAuthenticated={!!user}
            userCredits={userProfile?.credits}
          />

          {/* Features */}
          <div className="mt-8 sm:mt-12 lg:mt-16 grid gap-4 sm:gap-6 sm:grid-cols-3">
            {[
              {
                title: "AI-Powered",
                description:
                  "Advanced face detection and natural blending",
              },
              {
                title: "Fast Processing",
                description: "Results in 30-60 seconds",
              },
              {
                title: "High Quality",
                description: "Maintains original image resolution",
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
                  How does AI face swapping work?
                </h3>
                <p className="mt-2 text-xs sm:text-sm lg:text-base text-muted-foreground">
                  Our AI detects faces in both images, extracts facial features and landmarks, 
                  then seamlessly blends the source face onto the target image with natural 
                  alignment and color matching. The process takes 30-60 seconds.
                </p>
              </div>
              <div className="rounded-lg border border-border p-4 sm:p-6">
                <h3 className="text-sm sm:text-base font-semibold">
                  Is face swapping free to use?
                </h3>
                <p className="mt-2 text-xs sm:text-sm lg:text-base text-muted-foreground">
                  You can try face swapping for free (2 credits per swap). Sign up for a 
                  free account to get 10 credits, or upgrade to Pro for 200 credits per month.
                </p>
              </div>
              <div className="rounded-lg border border-border p-4 sm:p-6">
                <h3 className="text-sm sm:text-base font-semibold">
                  What types of images work best for face swapping?
                </h3>
                <p className="mt-2 text-xs sm:text-sm lg:text-base text-muted-foreground">
                  Use clear, front-facing photos with good lighting. Both images should have 
                  clearly visible faces. Higher resolution images produce better quality results.
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
    </div>
  );
}
