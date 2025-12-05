import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks"
import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

// Use service role for webhook handling (bypasses RLS)
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const PLAN_CREDITS: Record<string, number> = {
  pro: 200,
  enterprise: 2000,
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const headers = Object.fromEntries(req.headers.entries())

    const event = validateEvent(
      body,
      headers,
      process.env.POLAR_WEBHOOK_SECRET ?? ""
    )

    console.log("Polar webhook received:", event.type)

    switch (event.type) {
      case "checkout.created":
        console.log("Checkout created:", event.data.id)
        break

      case "checkout.updated":
        console.log("Checkout updated:", event.data.id, event.data.status)
        break

      case "order.created": {
        const order = event.data
        console.log("Order created:", order.id)

        const userId = order.metadata?.user_id as string
        if (!userId) {
          console.error("No user_id in order metadata")
          break
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
          break
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
        break
      }

      case "subscription.created": {
        const subscription = event.data
        console.log("Subscription created:", subscription.id)

        const userId = subscription.metadata?.user_id as string
        if (!userId) {
          console.error("No user_id in subscription metadata")
          break
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
          break
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
        break
      }

      case "subscription.updated": {
        const subscription = event.data
        console.log("Subscription updated:", subscription.id)

        const userId = subscription.metadata?.user_id as string
        if (!userId) break

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
        break
      }

      case "subscription.canceled": {
        const subscription = event.data
        console.log("Subscription canceled:", subscription.id)

        const userId = subscription.metadata?.user_id as string
        if (!userId) break

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
        break
      }

      default:
        console.log("Unhandled event type:", event.type)
    }

    return new NextResponse("", { status: 202 })
  } catch (error) {
    if (error instanceof WebhookVerificationError) {
      console.error("Webhook verification failed:", error.message)
      return new NextResponse("", { status: 403 })
    }
    console.error("Webhook error:", error)
    throw error
  }
}
