import { Eraser, Heart, Target, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Our Mission & Story | Erazor AI",
  description:
    "Learn about Erazor AI, our mission to make professional AI-powered image editing accessible to everyone. Meet the team behind the technology.",
  openGraph: {
    title: "About Erazor AI - Our Mission & Story",
    description:
      "Learn about Erazor AI, our mission to make professional AI-powered image editing accessible to everyone.",
    url: "https://www.erazor.app/about",
    siteName: "Erazor AI",
    images: [
      {
        url: "https://www.erazor.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "About Erazor AI",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Erazor AI - Our Mission & Story",
    description:
      "Learn about Erazor AI and our mission to make professional image editing accessible to everyone.",
  },
  alternates: {
    canonical: "https://www.erazor.app/about",
  },
};

export default function AboutPage() {
  return (
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <Eraser className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              About Erazor AI
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Making professional image editing accessible to everyone.
            </p>
          </div>

          {/* Content */}
          <div className="mt-16 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold">Our Story</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Erazor AI was born from a simple frustration: professional image
                editing tools were either too expensive, too complicated, or too
                slow. We believed that removing a background or upscaling an
                image shouldn't require a design degree or expensive software.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                So we built Erazor AI—a tool that harnesses the power of
                artificial intelligence to deliver professional-quality results
                in seconds, accessible to anyone with a browser.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">Our Values</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-3">
                {[
                  {
                    icon: Target,
                    title: "Simplicity",
                    description:
                      "Powerful tools shouldn't be complicated. We focus on making things simple.",
                  },
                  {
                    icon: Zap,
                    title: "Speed",
                    description:
                      "Time is precious. Our AI delivers results in seconds, not minutes.",
                  },
                  {
                    icon: Heart,
                    title: "Accessibility",
                    description:
                      "Great tools should be available to everyone, regardless of budget.",
                  },
                ].map((value) => (
                  <div
                    key={value.title}
                    className="rounded-xl border border-border p-6"
                  >
                    <value.icon className="h-8 w-8 text-primary" />
                    <h3 className="mt-4 font-semibold">{value.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">The Technology</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Erazor AI is powered by state-of-the-art machine learning models
                that have been trained on millions of images. Our background
                removal AI can handle complex edges, hair, and transparent
                objects with remarkable precision. Our upscaling AI doesn't just
                stretch pixels—it intelligently adds detail to create
                natural-looking high-resolution images.
              </p>
            </section>

            <section className="rounded-xl border border-border bg-muted/30 p-8 text-center">
              <h2 className="text-2xl font-semibold">Ready to try it?</h2>
              <p className="mt-2 text-muted-foreground">
                Get started for free with 3 credits. No signup required.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <a
                  href="/tools/remove-background"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Try Background Removal
                </a>
                <a
                  href="/tools/upscale"
                  className="inline-flex items-center justify-center rounded-md border border-border px-6 py-2.5 text-sm font-medium hover:bg-muted"
                >
                  Try Image Upscaling
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>
  );
}
