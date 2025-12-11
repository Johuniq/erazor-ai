import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ArrowRight,
    Building2,
    Camera,
    CheckCircle2,
    Globe,
    Instagram,
    Palette,
    Shirt,
    ShoppingBag,
    User
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Use Cases - AI Image Editing for Ecommerce, Social Media & More | Erazor AI",
  description:
    "Discover how Erazor AI helps ecommerce sellers, social media marketers, photographers, and designers. Remove backgrounds and upscale images for product photos, listings, content creation, and professional photography.",
  keywords: [
    "ecommerce product photos",
    "social media image editor",
    "product photography tools",
    "marketplace listing photos",
    "instagram content creation",
    "professional portrait editing",
    "real estate photo editing",
    "fashion photography editing",
    "graphic design tools",
    "marketing image editor",
    "online store photos",
    "product background removal",
    "image editing for business",
    "professional photo editing",
    "content creator tools"
  ],
  openGraph: {
    title: "Use Cases - AI Image Editing Solutions | Erazor AI",
    description:
      "See how businesses and creators use Erazor AI for ecommerce, social media, photography, and design.",
    url: "https://www.erazor.app/use-cases",
    siteName: "Erazor AI",
    images: [
      {
        url: "https://www.erazor.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Erazor AI Use Cases",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Use Cases - AI Image Editing Solutions | Erazor AI",
    description:
      "See how businesses and creators use Erazor AI for ecommerce, social media, and more.",
  },
  alternates: {
    canonical: "https://www.erazor.app/use-cases",
  },
};

const useCases = [
  {
    title: "Ecommerce & Online Stores",
    description: "Create professional product photos for your online store. Remove distracting backgrounds and create consistent white/transparent backgrounds across your entire catalog.",
    icon: ShoppingBag,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    benefits: [
      "Consistent product catalog",
      "Professional white backgrounds",
      "Higher conversion rates",
      "Stand out on marketplaces",
      "Batch process 100s of products",
      "Save on photoshoot costs"
    ],
    stats: { metric: "35%", label: "Higher conversion with clean backgrounds" },
    tools: ["Background Remover", "Batch Processing"]
  },
  {
    title: "Social Media Marketing",
    description: "Create eye-catching content for Instagram, Facebook, TikTok, and more. Remove backgrounds, upscale for quality, and make your posts stand out in the feed.",
    icon: Instagram,
    color: "text-pink-500",
    bgColor: "bg-pink-50 dark:bg-pink-950",
    benefits: [
      "Attention-grabbing posts",
      "Consistent brand aesthetic",
      "Perfect for stories & reels",
      "High-res images for all platforms",
      "Professional-looking content",
      "Boost engagement rates"
    ],
    stats: { metric: "3x", label: "More engagement with professional images" },
    tools: ["Background Remover", "Image Upscaler", "Background Addition"]
  },
  {
    title: "Portrait & Profile Photos",
    description: "Perfect for headshots, LinkedIn profiles, resumes, and professional portraits. Remove messy backgrounds and present yourself professionally.",
    icon: User,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950",
    benefits: [
      "Professional headshots",
      "Perfect for LinkedIn",
      "Clean resume photos",
      "ID photo creation",
      "Team directory photos",
      "Dating app profiles"
    ],
    stats: { metric: "40%", label: "More profile views with pro headshots" },
    tools: ["Background Remover", "Background Addition"]
  },
  {
    title: "Real Estate Photography",
    description: "Enhance property photos for listings. Remove unwanted elements, upscale low-res photos, and create stunning listing images that sell.",
    icon: Building2,
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950",
    benefits: [
      "Professional listing photos",
      "Remove unwanted objects",
      "Enhance low-quality images",
      "Virtual staging prep",
      "Flyer & brochure ready",
      "Attract more buyers"
    ],
    stats: { metric: "61%", label: "Faster sales with professional photos" },
    tools: ["Image Upscaler", "Background Remover"]
  },
  {
    title: "Fashion & Apparel",
    description: "Perfect for clothing brands, fashion boutiques, and apparel sellers. Create ghost mannequin effects, remove backgrounds, and showcase products professionally.",
    icon: Shirt,
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-950",
    benefits: [
      "Ghost mannequin effect",
      "Consistent product shots",
      "Fashion lookbooks",
      "Size guide creation",
      "Social commerce ready",
      "Fast turnaround time"
    ],
    stats: { metric: "45%", label: "Better click-through with clean images" },
    tools: ["Background Remover", "Batch Processing"]
  },
  {
    title: "Professional Photography",
    description: "Speed up your photo editing workflow. Batch remove backgrounds, upscale images for print, and deliver client work faster without compromising quality.",
    icon: Camera,
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950",
    benefits: [
      "Faster client delivery",
      "Batch background removal",
      "Print-ready upscaling",
      "Portfolio enhancement",
      "Save editing time",
      "More time for shooting"
    ],
    stats: { metric: "80%", label: "Time saved on background editing" },
    tools: ["Background Remover", "Image Upscaler", "Batch Processing"]
  },
  {
    title: "Marketplace Sellers",
    description: "Optimize photos for Amazon, eBay, Etsy, and other marketplaces. Meet platform requirements with white backgrounds and high-quality images.",
    icon: Globe,
    color: "text-cyan-500",
    bgColor: "bg-cyan-50 dark:bg-cyan-950",
    benefits: [
      "Meet Amazon requirements",
      "Pure white backgrounds",
      "eBay listing optimization",
      "Etsy shop photos",
      "Multiple marketplace formats",
      "Increase search visibility"
    ],
    stats: { metric: "50%", label: "Higher search ranking with optimized images" },
    tools: ["Background Remover", "Image Upscaler"]
  },
  {
    title: "Graphic Design & Creative",
    description: "Extract elements for designs, create marketing materials, and enhance visuals for print and web. Perfect for designers and creative professionals.",
    icon: Palette,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-950",
    benefits: [
      "Extract design elements",
      "Marketing collateral",
      "Print design prep",
      "Web design assets",
      "Presentation graphics",
      "Creative compositing"
    ],
    stats: { metric: "70%", label: "Faster design workflow" },
    tools: ["Background Remover", "Image Upscaler", "Background Addition"]
  }
];

const platforms = [
  { name: "Amazon", logo: "📦" },
  { name: "eBay", logo: "🛒" },
  { name: "Shopify", logo: "🏪" },
  { name: "Etsy", logo: "🎨" },
  { name: "Instagram", logo: "📸" },
  { name: "Facebook", logo: "👥" },
];

export default function UseCasesPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background to-muted/20 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4" variant="secondary">
              Use Cases
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              AI Image Editing for Every Business
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              From ecommerce to social media, real estate to fashion. Discover how Erazor AI helps professionals and businesses 
              <span className="font-semibold text-foreground"> create stunning images in seconds.</span>
            </p>
          </div>

          {/* Platform Logos */}
          <div className="mt-12 border-t pt-8">
            <p className="text-center text-sm font-medium text-muted-foreground">
              TRUSTED BY SELLERS & CREATORS ON
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
              {platforms.map((platform) => (
                <div key={platform.name} className="flex items-center gap-2 text-lg">
                  <span className="text-2xl">{platform.logo}</span>
                  <span className="font-medium">{platform.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Find Your Use Case
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              See how businesses and creators use Erazor AI
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {useCases.map((useCase) => {
              const Icon = useCase.icon;
              return (
                <Card key={useCase.title} className="group overflow-hidden transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`rounded-xl ${useCase.bgColor} p-3`}>
                        <Icon className={`h-6 w-6 ${useCase.color}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl">{useCase.title}</CardTitle>
                        <CardDescription className="mt-2 text-base">
                          {useCase.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Stats */}
                    <div className="mb-6 rounded-lg border bg-muted/50 p-4">
                      <div className="text-2xl font-bold">{useCase.stats.metric}</div>
                      <div className="text-sm text-muted-foreground">{useCase.stats.label}</div>
                    </div>

                    {/* Benefits */}
                    <div className="mb-6">
                      <h4 className="mb-3 text-sm font-semibold">Key Benefits:</h4>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {useCase.benefits.map((benefit) => (
                          <div key={benefit} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                            <span className="text-muted-foreground">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tools */}
                    <div className="mb-4">
                      <h4 className="mb-2 text-sm font-semibold">Recommended Tools:</h4>
                      <div className="flex flex-wrap gap-2">
                        {useCase.tools.map((tool) => (
                          <Badge key={tool} variant="secondary" className="text-xs">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button asChild className="w-full group-hover:gap-3" variant="outline">
                      <Link href="/tools">
                        Explore Tools
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

      {/* Industry Stats */}
      <section className="border-t bg-muted/20 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              By The Numbers
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Why professional images matter for your business
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-background p-6 text-center">
              <div className="text-4xl font-bold text-blue-500">90%</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Of online shoppers say image quality influences purchase decisions
              </p>
            </div>
            <div className="rounded-lg border bg-background p-6 text-center">
              <div className="text-4xl font-bold text-purple-500">3.2x</div>
              <p className="mt-2 text-sm text-muted-foreground">
                More engagement on social posts with professional images
              </p>
            </div>
            <div className="rounded-lg border bg-background p-6 text-center">
              <div className="text-4xl font-bold text-green-500">67%</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Of consumers say image quality is "very important" when shopping
              </p>
            </div>
            <div className="rounded-lg border bg-background p-6 text-center">
              <div className="text-4xl font-bold text-orange-500">85%</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Faster time-to-market with AI-powered image editing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Transform Your Workflow?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join 500,000+ professionals using Erazor AI to create stunning images.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/tools">
                Explore All Tools
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/signup">
                Start Free Trial
              </Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            No credit card required • 3 free images • Cancel anytime
          </p>
        </div>
      </section>
    </main>
  );
}
