"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Sparkles, Zap } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const plans = [
  {
    name: "Free",
    description: "Try it out with no commitment",
    monthlyPrice: 0,
    yearlyPrice: 0,
    credits: 10,
    features: [
      "10 free credits",
      "Background removal",
      "Image upscaling (2x)",
      "Standard quality",
      "Community support",
    ],
    cta: "Get Started Free",
    href: "/signup",
  },
  {
    name: "Pro",
    description: "For professionals and small teams",
    monthlyPrice: 19,
    yearlyPrice: 190,
    credits: 200,
    features: [
      "200 credits/month",
      "Background removal",
      "Image upscaling (4x)",
      "HD quality export",
      "Priority processing",
      "Email support",
      "History & downloads",
    ],
    cta: "Start Pro Trial",
    href: "/signup?plan=pro",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For large teams and businesses",
    monthlyPrice: 99,
    yearlyPrice: 990,
    credits: 2000,
    features: [
      "2000 credits/month",
      "Everything in Pro",
      "Batch processing",
      "API access",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    href: "/contact",
  },
]

export function PricingSection() {
  const [annual, setAnnual] = useState(false)

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
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col transition-all duration-300 ${
                plan.popular
                  ? "border-primary shadow-xl shadow-primary/10 scale-[1.02]"
                  : "border-border/50 hover:border-border hover:shadow-lg"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="gap-1.5 px-4 py-1.5 shadow-lg">
                    <Sparkles className="h-3.5 w-3.5" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className={plan.popular ? "pt-10" : ""}>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-2">
                  <span className="text-4xl font-bold">${annual ? plan.yearlyPrice : plan.monthlyPrice}</span>
                  {plan.monthlyPrice > 0 && <span className="text-muted-foreground">/{annual ? "year" : "month"}</span>}
                </div>
                <p className="mb-6 text-sm text-muted-foreground">
                  {plan.credits.toLocaleString()} credits {plan.monthlyPrice > 0 ? "per month" : "to start"}
                </p>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
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
                  className={`w-full gap-2 ${plan.popular ? "shadow-lg" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  <Link href={plan.href}>
                    {plan.popular && <Zap className="h-4 w-4" />}
                    {plan.cta}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          All plans include a 7-day money-back guarantee. No questions asked.
        </p>
      </div>
    </section>
  )
}
