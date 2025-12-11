import { ComparisonSection } from "@/components/landing/comparison-section"
import { CTASection } from "@/components/landing/cta-section"
import { FAQSection } from "@/components/landing/faq-section"
import FeaturesSection from "@/components/landing/features-section"
import { FloatingPromoCard } from "@/components/landing/floating-card"
import { HeroSection } from "@/components/landing/hero-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { LogosSection } from "@/components/landing/logos-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { UseCases } from "@/components/landing/use-cases-section"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free AI Image Editor Online - Remove Background & Upscale Images | Erazor AI",
  description: "Best free AI image editor online. Remove background from any image in seconds & upscale photos up to 4x resolution. Professional background remover tool. No watermark. Start free - no credit card needed!",
  keywords: [
    "ai image editor online free",
    "remove background from image",
    "free background remover",
    "ai background remover",
    "image upscaler free",
    "upscale image online",
    "ai photo editor",
    "remove bg from image",
    "transparent background maker",
    "background eraser online",
    "photo background remover free",
    "enlarge image without losing quality",
    "increase image resolution online",
    "4x image upscaler",
    "online photo editor",
    "product image editor",
    "ecommerce photo editing",
    "best background remover",
    "ai image enhancement",
    "professional image editing online"
  ],
  alternates: {
    canonical: "https://www.erazor.app",
  },
}

export default async function HomePage() {

  return (
    <>
      <main className="flex-1">
        <HeroSection />
        <LogosSection />
        <FeaturesSection />
        <HowItWorksSection />
        <UseCases />
        <ComparisonSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      
      <FloatingPromoCard
        title="BLACK FRIDAY SALE"
        description="All Plans"
        discount="50% OFF"
        code="BF50"
        ctaText="Claim Deal Now"
        ctaHref="#pricing"
        position="bottom-right"
        autoShow={true}
        delay={3000}
      />
    </>
  )
}
