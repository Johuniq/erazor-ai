import { ManageSubscriptionButton } from "@/components/dashboard/manage-subscription-button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"
import { Polar } from "@polar-sh/sdk"
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  CreditCard,
  Receipt,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: "production",
})

// Plan credits allocation (matches webhook PLAN_CREDITS)
const planCredits: Record<string, { monthly: number; yearly: number }> = {
  free: { monthly: 10, yearly: 10 },
  pro: { monthly: 200, yearly: 2600 },
  enterprise: { monthly: 2000, yearly: 26000 },
}

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
      "200 credits/month",
      "Background removal",
      "Batch processing",
      "Image upscaling (4x)",
      "HD quality export",
      "Priority processing",
      "Email support",
      "History & downloads",
    ],
    yearly: [
      "2600 credits/year (~217/month)",
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
      "2000 credits/month",
      "Everything in Pro",
      "Batch processing",
      "API access",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
    ],
    yearly: [
      "26000 credits/year (~2167/month)",
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

async function getSubscription(customerId: string | null, externalId: string | null) {
  try {
    // Try with customerId first
    if (customerId) {
      const result = await polar.subscriptions.list({
        customerId,
        limit: 1,
      })
      if (result.result.items.length > 0) {
        return result.result.items[0]
      }
    }
    
    // Fallback to external customer ID (Supabase user ID)
    if (externalId) {
      // First get customer by externalId
      try {
        const customer = await polar.customers.getExternal({ externalId })
        if (customer?.id) {
          const result = await polar.subscriptions.list({
            customerId: customer.id,
            limit: 1,
          })
          return result.result.items[0] || null
        }
      } catch (e) {
        // Customer not found by externalId, continue to return null
      }
    }
    
    return null
  } catch (error) {
    console.error("Error fetching subscription:", error)
    return null
  }
}

async function getOrders(customerId: string | null, externalId: string | null) {
  try {
    // Try with customerId first
    if (customerId) {
      const result = await polar.orders.list({
        customerId,
        limit: 10,
      })
      if (result.result.items.length > 0) {
        return result.result.items
      }
    }
    
    // Fallback to external customer ID
    if (externalId) {
      try {
        const customer = await polar.customers.getExternal({ externalId })
        if (customer?.id) {
          const result = await polar.orders.list({
            customerId: customer.id,
            limit: 10,
          })
          return result.result.items
        }
      } catch {
        // Customer not found
      }
    }
    
    return []
  } catch (error) {
    console.error("Error fetching orders:", error)
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

  // Get usage stats for this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { data: usageThisMonth } = await supabase
    .from("credit_transactions")
    .select("amount")
    .eq("user_id", user.id)
    .eq("type", "usage")
    .gte("created_at", startOfMonth.toISOString())

  const creditsUsedThisMonth = usageThisMonth?.reduce((sum, tx) => sum + Math.abs(tx.amount), 0) || 0

  const products = await getProducts()
  const hasProducts = products.length > 0

  // Fetch subscription details from Polar (try polar_customer_id first, then user.id as externalId)
  const subscription = await getSubscription(profile?.polar_customer_id || null, user.id)
  const orders = await getOrders(profile?.polar_customer_id || null, user.id)

  // Calculate credit usage - use actual credits remaining, don't calculate negative values
  const currentPlan = profile?.plan || "free"
  const isYearly = subscription?.recurringInterval === "year"
  const maxCredits = planCredits[currentPlan]?.[isYearly ? "yearly" : "monthly"] || 10
  const creditsRemaining = profile?.credits || 0
  // If remaining > max, user has bonus credits, show total as remaining
  const effectiveMax = Math.max(maxCredits, creditsRemaining)
  const creditsUsed = Math.max(0, effectiveMax - creditsRemaining)
  const usagePercentage = effectiveMax > 0 ? Math.min((creditsUsed / effectiveMax) * 100, 100) : 0

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 space-y-4 sm:space-y-6">
      {/* Page header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-primary/10 shadow-sm">
            <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Billing & Credits</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage your subscription and credits</p>
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

      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {/* Current Plan Card */}
        <Card className="shadow-sm border-border/60">
          <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Current Plan</p>
                  <p className="text-lg sm:text-xl font-bold capitalize">{currentPlan}</p>
                </div>
              </div>
              <Badge variant={currentPlan === "free" ? "secondary" : "default"}>
                {currentPlan === "free" ? "Free" : "Active"}
              </Badge>
            </div>
            {subscription?.currentPeriodEnd && (
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Renews{" "}
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Credits Remaining Card */}
        <Card className="shadow-sm border-border/60">
          <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-accent/10">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Credits Remaining</p>
                  <p className="text-lg sm:text-xl font-bold">{creditsRemaining}</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">/ {effectiveMax}</span>
            </div>
            <Progress value={((creditsRemaining / effectiveMax) * 100)} className="h-2" />
            <p className="mt-2 text-xs text-muted-foreground">
              {creditsUsedThisMonth > 0 ? `${creditsUsedThisMonth} credits used this month` : "No credits used this period"}
            </p>
          </CardContent>
        </Card>

        {/* Usage This Month Card */}
        <Card className="shadow-sm border-border/60">
          <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Used This Month</p>
                <p className="text-lg sm:text-xl font-bold">{creditsUsedThisMonth}</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {new Date().toLocaleDateString(undefined, { month: "long", year: "numeric" })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Management Card */}
      {currentPlan !== "free" && (
        <Card className="shadow-sm border-border/60">
          <CardHeader className="pb-3 p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Subscription Details</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Manage your subscription and billing</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
              <ManageSubscriptionButton />
              <Button variant="outline" asChild>
                <Link href="#plans" className="gap-1.5">
                  Change Plan
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            {subscription && (
              <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Started:</span>
                  <span className="font-medium">
                    {new Date(subscription.startedAt || subscription.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Billing:</span>
                  <span className="font-medium capitalize">{subscription.recurringInterval}ly</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="outline" className="capitalize">{subscription.status}</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Current Plan Card - For Free Users */}
      {currentPlan === "free" && (
        <Card className="shadow-sm border-border/60 overflow-hidden py-0 gap-0">
          <div className="bg-gradient-to-r from-primary/5 via-transparent to-accent/5 py-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Upgrade to Pro</CardTitle>
              <CardDescription>Get more credits and premium features</CardDescription>
            </CardHeader>
            <CardContent className="pt-2 pb-0">
              <div className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
                <p className="text-sm text-muted-foreground">
                  You&apos;re on the free plan with <span className="font-semibold text-foreground">{creditsRemaining}</span> credits remaining.
                </p>
                <Button asChild>
                  <Link href="#plans" className="gap-1.5">
                    View Plans
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      )}

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
                        
                        // Check if this is the current plan by comparing plan key with profile plan
                        const productNameLower = product.name.toLowerCase()
                        const planKey = productNameLower.includes("enterprise")
                          ? "enterprise"
                          : productNameLower.includes("pro")
                            ? "pro"
                            : ""
                        const isCurrentPlan = profile?.plan?.toLowerCase() === planKey
                        
                        // Use hardcoded benefits based on product name (match "pro" or "enterprise" in name)
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

      {/* Invoices & Receipts */}
      {orders.length > 0 && (
        <Card className="shadow-sm border-border/60">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Invoices & Receipts</CardTitle>
                <CardDescription>Download your payment receipts</CardDescription>
              </div>
              <Badge variant="outline" className="text-muted-foreground">
                {orders.length} orders
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-xl border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Receipt className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{order.product?.name || "Subscription"}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: order.currency || "usd",
                        }).format((order.totalAmount || 0) / 100)}
                      </p>
                      <Badge variant="outline" className="text-xs capitalize">
                        {order.billingReason?.replace("_", " ") || "Purchase"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
