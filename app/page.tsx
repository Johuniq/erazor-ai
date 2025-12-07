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
  title: "Erazor AI - Professional AI Image Editor | Remove Backgrounds & Upscale Images",
  description: "Professional AI-powered image editing tools. Remove backgrounds instantly, upscale images to 4K, and enhance your photos with advanced AI technology. Try it free!",
  keywords: [
    "AI image editor",
    "AI background remover",
    "AI image upscaler",
    "remove background",
    "upscale image",
    "AI photo editor",
    "image editing tools",
    "professional image editing",
    "AI image enhancement",
    "background removal tool",
    "image quality enhancer",
    "4K upscaling",
    "online image editor",
    "AI image processing",
    "photo editing software"
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
