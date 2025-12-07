import { ComparisonSection } from "@/components/landing/comparison-section"
import { CTASection } from "@/components/landing/cta-section"
import { FAQSection } from "@/components/landing/faq-section"
import FeaturesSection from "@/components/landing/features-section"
import { HeroSection } from "@/components/landing/hero-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { LogosSection } from "@/components/landing/logos-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { UseCases } from "@/components/landing/use-cases-section"
import type { Metadata } from "next"

export const metadata: Metadata = {
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
    </>
  )
}
