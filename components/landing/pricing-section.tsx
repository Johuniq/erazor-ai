"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useProductsStore } from "@/lib/store/products-store"
import { Check, Sparkles, Zap } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

// Hardcoded benefits for each plan (monthly and yearly)
const planBenefits: Record<string, { monthly: string[]; yearly: string[] }> = {
  free: {
    monthly: [
      "10 free credits",
      "Background removal",
      "Image upscaling (2x)",
      "Standard quality",
      "Community support",
    ],
    yearly: [
      "10 free credits",
      "Background removal",
      "Image upscaling (2x)",
      "Standard quality",
      "Community support",
    ],
  },
  pro: {
    monthly: [
      "100 credits/month",
      "Background removal",
      "Batch processing",
      "Image upscaling (4x)",
      "HD quality export",
      "Priority processing",
      "Email support",
      "History & downloads",
    ],
    yearly: [
      "1300 credits/year (~109/month)",
      "Background removal",
      "Batch processing",
      "Image upscaling (4x)",
      "HD quality export",
      "Priority processing",
      "Email support",
      "History & downloads",
    ],
  },
  enterprise: {
    monthly: [
      "200 credits/month",
      "Everything in Pro",
      "Batch processing",
      "API access",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
    ],
    yearly: [
      "2500 credits/year (~209/month)",
      "Everything in Pro",
      "Batch processing",
      "API access",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
    ],
  },
}

// Free plan (always shown)
const freePlan = {
  name: "Free",
  description: "Try it out with no commitment",
  monthlyPrice: 0,
  yearlyPrice: 0,
  credits: "10 credits to start",
  features: planBenefits.free.monthly,
  cta: "Get Started Free",
  href: "/signup",
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount / 100)
}

export function PricingSection() {
  const [annual, setAnnual] = useState(false)
  const { products, isLoading, fetchProducts } = useProductsStore()

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Filter products based on billing interval
  const filteredProducts = products.filter((product) => {
    return product.prices.some((price) => {
      if (price.type === "recurring" && price.recurringInterval) {
        return annual
          ? price.recurringInterval === "year"
          : price.recurringInterval === "month"
      }
      return false
    })
  })

  return (
    <section id="pricing" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary my-4">
            Pricing
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className={`text-sm ${!annual ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={annual}
              onClick={() => setAnnual(!annual)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${annual ? "bg-primary" : "bg-input"}`}
            >
              <span
                className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${annual ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
            <span className={`text-sm ${annual ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              Annual
              <Badge variant="secondary" className="ml-2 text-xs">
                Save 20%
              </Badge>
            </span>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {/* Free Plan - Always shown */}
          <Card className="relative flex flex-col transition-all duration-300 border-border/50 hover:border-border hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">{freePlan.name}</CardTitle>
              <CardDescription>{freePlan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-2">
                <span className="text-4xl font-bold">$0</span>
              </div>
              <p className="mb-6 text-sm text-muted-foreground">{freePlan.credits}</p>
              <ul className="space-y-3">
                {freePlan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full gap-2" variant="outline">
                <Link href={freePlan.href}>{freePlan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Dynamic Plans from API */}
          {isLoading ? (
            <>
              <Card className="relative flex flex-col">
                <CardHeader className="pt-10">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-48 mt-2" />
                </CardHeader>
                <CardContent className="flex-1">
                  <Skeleton className="h-10 w-32 mb-2" />
                  <Skeleton className="h-4 w-40 mb-6" />
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
              <Card className="relative flex flex-col">
                <CardHeader>
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-48 mt-2" />
                </CardHeader>
                <CardContent className="flex-1">
                  <Skeleton className="h-10 w-32 mb-2" />
                  <Skeleton className="h-4 w-40 mb-6" />
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            </>
          ) : (
            filteredProducts.map((product, index) => {
              const price = product.prices.find((p) => {
                if (p.type === "recurring" && p.recurringInterval) {
                  return annual
                    ? p.recurringInterval === "year"
                    : p.recurringInterval === "month"
                }
                return false
              })

              const priceAmount = price?.priceAmount || 0
              const isPopular = index === 0

              // Get hardcoded benefits based on product name
              const productNameLower = product.name.toLowerCase()
              const planKey = productNameLower.includes("enterprise")
                ? "enterprise"
                : productNameLower.includes("pro")
                  ? "pro"
                  : ""
              const planBenefitSet = planBenefits[planKey]
              const features = planBenefitSet ? (annual ? planBenefitSet.yearly : planBenefitSet.monthly) : []

              return (
                <Card
                  key={product.id}
                  className={`relative flex flex-col transition-all duration-300 ${
                    isPopular
                      ? "border-primary shadow-xl shadow-primary/10 scale-[1.02]"
                      : "border-border/50 hover:border-border hover:shadow-lg"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="gap-1.5 px-4 py-1.5 shadow-lg">
                        <Sparkles className="h-3.5 w-3.5" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className={isPopular ? "pt-10" : ""}>
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                    {product.description && <CardDescription>{product.description}</CardDescription>}
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="mb-2">
                      <span className="text-4xl font-bold">{formatPrice(priceAmount)}</span>
                      <span className="text-muted-foreground">/{annual ? "year" : "month"}</span>
                    </div>
                    <p className="mb-6 text-sm text-muted-foreground">
                      {planKey === "pro" 
                        ? (annual ? "1300 credits per year" : "100 credits per month") 
                        : (annual ? "2500 credits per year" : "200 credits per month")}
                    </p>
                    <ul className="space-y-3">
                      {features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      asChild
                      className={`w-full gap-2 ${isPopular ? "shadow-lg" : ""}`}
                      variant={isPopular ? "default" : "outline"}
                    >
                      <Link href={`/signup?plan=${planKey}`}>
                        {isPopular && <Zap className="h-4 w-4" />}
                        Upgrade
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })
          )}
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          All plans include a 7-day money-back guarantee. No questions asked.
        </p>
      </div>
    </section>
  )
}
