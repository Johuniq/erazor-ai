import { FaceSwapper } from "@/components/image-processing/face-swapper";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

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

  let userCredits = undefined;
  let userPlan = "free";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits, plan")
      .eq("id", user.id)
      .single();

    if (profile) {
      userCredits = profile.credits;
      userPlan = profile.plan || "free";
    }
  }

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            AI Face Swapper - Swap Faces Online Free
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-muted-foreground">
            Swap faces between two photos automatically using AI. Perfect for fun photos, creative projects, and entertainment.
          </p>
        </div>

        {/* Face Swapper Component */}
        <FaceSwapper
          title="AI Face Swapper"
          description="Swap faces between two photos automatically with AI"
          isAuthenticated={!!user}
          userCredits={userCredits}
          userPlan={userPlan}
        />
      </div>

      {/* SEO Content */}
      <section className="border-t bg-muted/20 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-3xl font-bold">
            How to Use AI Face Swapper
          </h2>
          
          <div className="prose prose-gray mx-auto max-w-none dark:prose-invert">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border bg-background p-6">
                <h3 className="mb-3 text-lg font-semibold">1. Upload Target Image</h3>
                <p className="text-sm text-muted-foreground">
                  Upload the photo where you want to replace the face. This is the base image that will receive the new face.
                </p>
              </div>

              <div className="rounded-lg border bg-background p-6">
                <h3 className="mb-3 text-lg font-semibold">2. Upload Source Face</h3>
                <p className="text-sm text-muted-foreground">
                  Upload the image containing the face you want to use. Our AI will detect and extract this face automatically.
                </p>
              </div>

              <div className="rounded-lg border bg-background p-6">
                <h3 className="mb-3 text-lg font-semibold">3. AI Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Our advanced AI detects faces, aligns features, and performs the swap with natural blending in 30-60 seconds.
                </p>
              </div>

              <div className="rounded-lg border bg-background p-6">
                <h3 className="mb-3 text-lg font-semibold">4. Download Result</h3>
                <p className="text-sm text-muted-foreground">
                  Review your swapped image and download in high quality. Create multiple variations by swapping different faces.
                </p>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="mb-4 text-2xl font-bold">
                What is Face Swapping?
              </h2>
              <p className="text-muted-foreground">
                Face swapping is an AI-powered image editing technique that replaces one person's face with another in photos. 
                Our AI face swapper uses advanced machine learning to detect facial features, align them properly, and blend 
                the swapped face naturally into the target image. This technology is perfect for creating fun photos, 
                entertainment content, and creative projects.
              </p>

              <h3 className="mb-3 mt-8 text-xl font-bold">
                Popular Use Cases
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>Entertainment:</strong> Create funny photos with celebrity faces or friends</li>
                <li>• <strong>Social Media:</strong> Generate engaging content for Instagram, TikTok, and Facebook</li>
                <li>• <strong>Creative Projects:</strong> Make artistic compositions and digital art</li>
                <li>• <strong>Before & After:</strong> Show transformations and comparisons</li>
                <li>• <strong>Memes:</strong> Create viral meme content with face swaps</li>
              </ul>

              <h3 className="mb-3 mt-8 text-xl font-bold">
                Why Choose Erazor AI Face Swapper?
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ <strong>AI-Powered Accuracy:</strong> Advanced face detection and alignment</li>
                <li>✓ <strong>Natural Results:</strong> Seamless blending for realistic swaps</li>
                <li>✓ <strong>Fast Processing:</strong> Results in 30-60 seconds</li>
                <li>✓ <strong>High Quality:</strong> Maintains original image resolution</li>
                <li>✓ <strong>Easy to Use:</strong> Simple 2-image upload process</li>
                <li>✓ <strong>Secure:</strong> Your images are processed securely and privately</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
