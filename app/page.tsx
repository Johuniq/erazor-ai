import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ComparisonSection } from "@/components/landing/comparison-section"
import { CTASection } from "@/components/landing/cta-section"
import { FAQSection } from "@/components/landing/faq-section"
import FeaturesSection from "@/components/landing/features-section"
import { HeroSection } from "@/components/landing/hero-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { LogosSection } from "@/components/landing/logos-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { ProductHuntBanner } from "@/components/landing/product-hunt-banner"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { UseCases } from "@/components/landing/use-cases-section"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col">
      <ProductHuntBanner />
      <Header isLoggedIn={!!user} />
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
      <Footer />
    </div>
  )
}
