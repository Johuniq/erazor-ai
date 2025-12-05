import { Button } from "@/components/ui/button"
import { ArrowRight, ImageMinus } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/30 to-background" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 px-6 py-16 text-center sm:px-16 sm:py-24">
          {/* Decorative elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          </div>
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
            Ready to transform your images?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-primary-foreground/80">
            Join 50,000+ creators using Erazor AI to create stunning visuals. Start for free today - no credit card
            required.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="h-13 gap-2 bg-white text-primary hover:bg-white/90 shadow-xl px-8"
            >
              <Link href="/tools/remove-background">
                <ImageMinus className="h-5 w-5" />
                Try Background Removal
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-13 gap-2 border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent px-8"
            >
              <Link href="/signup">
                Create Free Account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <p className="mt-8 text-sm text-primary-foreground/60">No credit card required. 3 free credits instantly.</p>
        </div>
      </div>
    </section>
  )
}
