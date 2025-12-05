import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"
import { Polar } from "@polar-sh/sdk"
import { AlertCircle, ArrowRight, Check, CheckCircle, Clock, CreditCard, Sparkles, Zap } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: "production",
})

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
      "Image upscaling (4x)",
      "HD quality export",
      "Priority processing",
      "Email support",
      "History & downloads",
    ],
    yearly: [
      "1300 credits/year (~109/month)",
      "Background removal",
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

// Free plan that's always shown
const freePlan = {
  id: "free",
  name: "Free",
  description: "Try it out with no commitment",
  credits: "10 credits to start",
  benefits: planBenefits.free.monthly,
}

async function getProducts() {
  try {
    const result = await polar.products.list({
      limit: 100,
      isArchived: false,
    })
    return result.result.items
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
  }).format(amount / 100)
}

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: transactions } = await supabase
    .from("credit_transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  const products = await getProducts()
  const hasProducts = products.length > 0

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Page header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 shadow-sm">
            <CreditCard className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Billing & Credits</h1>
            <p className="text-muted-foreground">Manage your subscription and credits</p>
          </div>
        </div>
      </div>

      {params.success && (
        <Alert className="border-accent/30 bg-accent/10">
          <CheckCircle className="h-4 w-4 text-accent" />
          <AlertDescription className="text-accent-foreground">
            Payment successful! Your credits have been added to your account.
          </AlertDescription>
        </Alert>
      )}

      {params.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {params.error === "checkout_failed"
              ? "Checkout failed. Please try again or contact support."
              : "An error occurred. Please try again."}
          </AlertDescription>
        </Alert>
      )}

      {/* Current Plan Card */}
      <Card className="shadow-sm border-border/60 overflow-hidden">
        <div className="bg-gradient-to-r from-primary/5 via-transparent to-accent/5">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Current Plan</CardTitle>
            <CardDescription>Your subscription details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-xl border border-border bg-background p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 shadow-sm">
                  <Zap className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl font-bold capitalize">{profile?.plan || "Free"}</span>
                    <Badge variant="secondary" className="text-xs">
                      Active
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{profile?.credits || 0}</span> credits remaining
                  </p>
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link href="#plans" className="gap-1.5">
                  Manage Plan
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Upgrade Plans */}
      <Card className="shadow-sm border-border/60" id="plans">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Upgrade Your Plan</CardTitle>
          <CardDescription>Get more credits and unlock premium features</CardDescription>
        </CardHeader>
        <CardContent>
          {hasProducts ? (
            <Tabs defaultValue="monthly" className="w-full">
              <div className="flex justify-center mb-6">
                <TabsList>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly (Save 20%)</TabsTrigger>
                </TabsList>
              </div>

              {["monthly", "yearly"].map((interval) => (
                <TabsContent key={interval} value={interval}>
                  <div className="grid gap-6 md:grid-cols-3">
                    {/* Free Plan */}
                    <div
                      className={cn(
                        "relative rounded-2xl border-2 p-6 transition-all border-border hover:border-border/80",
                        profile?.plan === "free" && "bg-muted/30"
                      )}
                    >
                      <div className="mb-6">
                        <h3 className="font-semibold text-lg">Free</h3>
                        <div className="mt-2 flex items-baseline gap-1">
                          <span className="text-4xl font-bold">$0</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{freePlan.credits}</p>
                      </div>

                      <ul className="mb-6 space-y-3">
                        {freePlan.benefits.map((benefit) => (
                          <li key={benefit} className="flex items-center gap-2.5 text-sm">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15">
                              <Check className="h-3 w-3 text-primary" />
                            </div>
                            {benefit}
                          </li>
                        ))}
                      </ul>

                      <Button variant="outline" className="w-full bg-transparent" disabled>
                        {profile?.plan === "free" ? "Current Plan" : "Free Tier"}
                      </Button>
                    </div>

                    {/* Dynamic Plans from Polar with hardcoded benefits */}
                    {products
                      .filter((product) => {
                        const hasMatchingPrice = product.prices.some((price) => {
                          if (price.type === "recurring" && "recurringInterval" in price) {
                            return interval === "monthly"
                              ? price.recurringInterval === "month"
                              : price.recurringInterval === "year"
                          }
                          return false
                        })
                        return hasMatchingPrice
                      })
                      .map((product, index) => {
                        const price = product.prices.find((p) => {
                          if (p.type === "recurring" && "recurringInterval" in p) {
                            return interval === "monthly"
                              ? p.recurringInterval === "month"
                              : p.recurringInterval === "year"
                          }
                          return false
                        })

                        const priceAmount =
                          price && price.amountType === "fixed" && "priceAmount" in price ? price.priceAmount : 0
                        const priceCurrency =
                          price && price.amountType === "fixed" && "priceCurrency" in price
                            ? price.priceCurrency
                            : "usd"

                        const isPopular = index === 0
                        const isCurrentPlan = profile?.plan?.toLowerCase() === product.name.toLowerCase()

                        // Use hardcoded benefits based on product name (match "pro" or "enterprise" in name)
                        const productNameLower = product.name.toLowerCase()
                        const planKey = productNameLower.includes("enterprise")
                          ? "enterprise"
                          : productNameLower.includes("pro")
                            ? "pro"
                            : ""
                        const planBenefitSet = planBenefits[planKey]
                        const benefits = planBenefitSet ? (interval === "yearly" ? planBenefitSet.yearly : planBenefitSet.monthly) : []

                        return (
                          <div
                            key={product.id}
                            className={cn(
                              "relative rounded-2xl border-2 p-6 transition-all",
                              isPopular
                                ? "border-primary shadow-lg shadow-primary/10 scale-[1.02]"
                                : "border-border hover:border-border/80",
                              isCurrentPlan && "bg-muted/30"
                            )}
                          >
                            {isPopular && (
                              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 shadow-sm">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Most Popular
                              </Badge>
                            )}

                            <div className="mb-6">
                              <h3 className="font-semibold text-lg">{product.name}</h3>
                              <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-4xl font-bold">
                                  {formatPrice(priceAmount, priceCurrency)}
                                </span>
                                <span className="text-muted-foreground">
                                  /{interval === "monthly" ? "month" : "year"}
                                </span>
                              </div>
                              {product.description && (
                                <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>
                              )}
                            </div>

                            <ul className="mb-6 space-y-3">
                              {benefits.map((benefit) => (
                                <li key={benefit} className="flex items-center gap-2.5 text-sm">
                                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15">
                                    <Check className="h-3 w-3 text-primary" />
                                  </div>
                                  {benefit}
                                </li>
                              ))}
                            </ul>

                            {isCurrentPlan ? (
                              <Button variant="outline" className="w-full bg-transparent" disabled>
                                Current Plan
                              </Button>
                            ) : (
                              <Button
                                asChild
                                variant={isPopular ? "default" : "outline"}
                                className={cn("w-full", !isPopular && "bg-transparent")}
                              >
                                <Link href={`/api/checkout?product=${product.id}`}>
                                  Upgrade
                                </Link>
                              </Button>
                            )}
                          </div>
                        )
                      })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="text-center py-8">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Payment system is being configured. Upgrades will be available soon.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="shadow-sm border-border/60">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Credit History</CardTitle>
              <CardDescription>Recent credit transactions</CardDescription>
            </div>
            {transactions && transactions.length > 0 && (
              <Badge variant="outline" className="text-muted-foreground">
                {transactions.length} transactions
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!transactions || transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-xl border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl",
                        tx.amount > 0 ? "bg-accent/15" : "bg-muted"
                      )}
                    >
                      <Zap className={cn("h-5 w-5", tx.amount > 0 ? "text-accent" : "text-muted-foreground")} />
                    </div>
                    <div>
                      <p className="font-medium capitalize">{tx.type}</p>
                      <p className="text-sm text-muted-foreground">{tx.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("font-semibold text-lg", tx.amount > 0 ? "text-accent" : "text-foreground")}>
                      {tx.amount > 0 ? "+" : ""}
                      {tx.amount}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
