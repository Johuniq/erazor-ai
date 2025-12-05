import { Webhooks } from "@polar-sh/nextjs"
import { createClient } from "@supabase/supabase-js"

// Use service role for webhook handling (bypasses RLS)
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const PLAN_CREDITS: Record<string, number> = {
  pro: 200,
  enterprise: 2000,
}

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onCheckoutCreated: async (checkout) => {
    console.log("Checkout created:", checkout.id)
  },
  onCheckoutUpdated: async (checkout) => {
    console.log("Checkout updated:", checkout.id, checkout.status)
  },
  onOrderCreated: async (order) => {
    console.log("Order created:", order.id)

    const userId = order.metadata?.user_id as string
    if (!userId) {
      console.error("No user_id in order metadata")
      return
    }

    // Determine plan from product
    const productName = order.product?.name?.toLowerCase() || ""
    let plan = "free"
    let credits = 10

    if (productName.includes("pro")) {
      plan = "pro"
      credits = PLAN_CREDITS.pro
    } else if (productName.includes("enterprise")) {
      plan = "enterprise"
      credits = PLAN_CREDITS.enterprise
    }

    // Update user profile with credits
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        plan,
        credits,
        polar_customer_id: order.customerId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      console.error("Failed to update profile:", error)
      return
    }

    // Log credit transaction
    await supabaseAdmin.from("credit_transactions").insert({
      user_id: userId,
      amount: credits,
      type: "purchase",
      description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} plan purchase`,
      reference_id: order.id,
    })

    console.log(`Updated user ${userId} to ${plan} plan with ${credits} credits`)
  },
  onSubscriptionCreated: async (subscription) => {
    console.log("Subscription created:", subscription.id)

    const userId = subscription.metadata?.user_id as string
    if (!userId) {
      console.error("No user_id in subscription metadata")
      return
    }

    // Determine plan from product
    const productName = subscription.product?.name?.toLowerCase() || ""
    let plan = "free"
    let credits = 10

    if (productName.includes("pro")) {
      plan = "pro"
      credits = PLAN_CREDITS.pro
    } else if (productName.includes("enterprise")) {
      plan = "enterprise"
      credits = PLAN_CREDITS.enterprise
    }

    // Update user profile
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        plan,
        credits,
        polar_subscription_id: subscription.id,
        polar_customer_id: subscription.customerId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      console.error("Failed to update profile:", error)
      return
    }

    // Log credit transaction
    await supabaseAdmin.from("credit_transactions").insert({
      user_id: userId,
      amount: credits,
      type: "purchase",
      description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} plan subscription`,
      reference_id: subscription.id,
    })

    console.log(`User ${userId} subscribed to ${plan} plan with ${credits} credits`)
  },
  onSubscriptionUpdated: async (subscription) => {
    console.log("Subscription updated:", subscription.id)

    const userId = subscription.metadata?.user_id as string
    if (!userId) return

    // Determine plan from product
    const productName = subscription.product?.name?.toLowerCase() || ""
    let plan = "free"
    let credits = 10

    if (productName.includes("pro")) {
      plan = "pro"
      credits = PLAN_CREDITS.pro
    } else if (productName.includes("enterprise")) {
      plan = "enterprise"
      credits = PLAN_CREDITS.enterprise
    }

    // Update user profile
    await supabaseAdmin
      .from("profiles")
      .update({
        plan,
        credits,
        polar_subscription_id: subscription.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    console.log(`User ${userId} updated to ${plan} plan`)
  },
  onSubscriptionCanceled: async (subscription) => {
    console.log("Subscription canceled:", subscription.id)

    const userId = subscription.metadata?.user_id as string
    if (!userId) return

    // Downgrade to free plan
    await supabaseAdmin
      .from("profiles")
      .update({
        plan: "free",
        polar_subscription_id: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    console.log(`User ${userId} downgraded to free plan`)
  },
  onPayload: async (payload) => {
    // Fallback handler for any other events
    console.log("Polar webhook received:", payload.type)
  },
})
