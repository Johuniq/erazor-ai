import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, Check, Zap, CheckCircle, AlertCircle, Sparkles, ArrowRight, Clock } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const POLAR_PRO_PRODUCT_ID = process.env.POLAR_PRO_PRODUCT_ID
const POLAR_ENTERPRISE_PRODUCT_ID = process.env.POLAR_ENTERPRISE_PRODUCT_ID

const plans = [
  {
    name: "Free",
    price: 0,
    credits: 10,
    features: ["10 free credits", "Background removal", "2x upscaling"],
    productId: null,
  },
  {
    name: "Pro",
    price: 19,
    credits: 200,
    features: ["200 credits/month", "Background removal", "4x upscaling", "Priority processing"],
    popular: true,
    productId: POLAR_PRO_PRODUCT_ID,
  },
  {
    name: "Enterprise",
    price: 99,
    credits: 2000,
    features: ["2000 credits/month", "Everything in Pro", "API access", "Dedicated support"],
    productId: POLAR_ENTERPRISE_PRODUCT_ID,
  },
]

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

  const polarConfigured = POLAR_PRO_PRODUCT_ID && POLAR_ENTERPRISE_PRODUCT_ID

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

      {!polarConfigured && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Payment system is being configured. Upgrades will be available soon.</AlertDescription>
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
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => {
              const isCurrentPlan = profile?.plan === plan.name.toLowerCase()
              const canUpgrade = plan.productId && polarConfigured

              return (
                <div
                  key={plan.name}
                  className={cn(
                    "relative rounded-2xl border-2 p-6 transition-all",
                    plan.popular
                      ? "border-primary shadow-lg shadow-primary/10 scale-[1.02]"
                      : "border-border hover:border-border/80",
                    isCurrentPlan && "bg-muted/30",
                  )}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 shadow-sm">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  )}

                  <div className="mb-6">
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      {plan.price > 0 && <span className="text-muted-foreground">/month</span>}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {plan.credits} credits {plan.price > 0 ? "per month" : "to start"}
                    </p>
                  </div>

                  <ul className="mb-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5 text-sm">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {isCurrentPlan ? (
                    <Button variant="outline" className="w-full bg-transparent" disabled>
                      Current Plan
                    </Button>
                  ) : canUpgrade ? (
                    <Button
                      asChild
                      variant={plan.popular ? "default" : "outline"}
                      className={cn("w-full", !plan.popular && "bg-transparent")}
                    >
                      <Link href={`/api/checkout?product=${plan.productId}`}>Upgrade to {plan.name}</Link>
                    </Button>
                  ) : plan.price === 0 ? (
                    <Button variant="outline" className="w-full bg-transparent" disabled>
                      Free Tier
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full bg-transparent" disabled>
                      Coming Soon
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
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
                        tx.amount > 0 ? "bg-accent/15" : "bg-muted",
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
