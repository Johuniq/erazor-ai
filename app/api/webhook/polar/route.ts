import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks"
import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

// Use service role for webhook handling (bypasses RLS)
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const PLAN_CREDITS: Record<string, number> = {
  pro: 200,
  starter: 200,
  enterprise: 2000,
}

// Helper to extract user_id from various places in event data
function getUserId(data: any): string | null {
  // Check metadata first
  if (data.metadata?.user_id) {
    return data.metadata.user_id as string
  }
  // Check customer metadata
  if (data.customer?.metadata?.user_id) {
    return data.customer.metadata.user_id as string
  }
  // Check external customer id (we set this as user.id)
  if (data.customer?.externalId) {
    return data.customer.externalId as string
  }
  return null
}

// Helper to determine plan and credits from product name
function getPlanFromProduct(productName: string): { plan: string; credits: number } {
  const name = productName.toLowerCase()
  
  if (name.includes("enterprise") || name.includes("business")) {
    return { plan: "enterprise", credits: PLAN_CREDITS.enterprise }
  }
  if (name.includes("pro") || name.includes("starter")) {
    return { plan: "pro", credits: PLAN_CREDITS.pro }
  }
  return { plan: "free", credits: 10 }
}

export async function POST(req: NextRequest) {
  console.log("=== Polar Webhook Received ===")
  
  try {
    const body = await req.text()
    const headers = Object.fromEntries(req.headers.entries())

    console.log("Webhook headers:", JSON.stringify(headers, null, 2))

    const event = validateEvent(
      body,
      headers,
      process.env.POLAR_WEBHOOK_SECRET ?? ""
    )

    console.log("Event type:", event.type)
    console.log("Event data:", JSON.stringify(event.data, null, 2))

    switch (event.type) {
      case "checkout.created":
        console.log("Checkout created:", event.data.id)
        break

      case "checkout.updated": {
        const checkout = event.data
        console.log("Checkout updated:", checkout.id, "Status:", checkout.status)
        
        // Handle successful checkout
        if (checkout.status === "succeeded") {
          const userId = getUserId(checkout)
          console.log("Checkout succeeded for user:", userId)
          
          if (userId && checkout.product) {
            const { plan, credits } = getPlanFromProduct(checkout.product.name || "")
            console.log(`Updating user ${userId} to ${plan} with ${credits} credits`)
            
            const { error } = await supabaseAdmin
              .from("profiles")
              .update({
                plan,
                credits,
                polar_customer_id: checkout.customerId,
                updated_at: new Date().toISOString(),
              })
              .eq("id", userId)

            if (error) {
              console.error("Failed to update profile on checkout:", error)
            } else {
              console.log(`Successfully updated user ${userId} via checkout`)
              
              // Log credit transaction
              await supabaseAdmin.from("credit_transactions").insert({
                user_id: userId,
                amount: credits,
                type: "purchase",
                description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} plan purchase`,
                reference_id: checkout.id,
              })
            }
          }
        }
        break
      }

      case "order.created": {
        const order = event.data
        console.log("Order created:", order.id)

        const userId = getUserId(order)
        if (!userId) {
          console.error("No user_id found in order:", JSON.stringify(order, null, 2))
          break
        }

        const { plan, credits } = getPlanFromProduct(order.product?.name || "")
        console.log(`Order: Updating user ${userId} to ${plan} with ${credits} credits`)

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

        const userId = getUserId(subscription)
        if (!userId) {
          console.error("No user_id found in subscription:", JSON.stringify(subscription, null, 2))
          break
        }

        const { plan, credits } = getPlanFromProduct(subscription.product?.name || "")
        console.log(`Subscription: Updating user ${userId} to ${plan} with ${credits} credits`)

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

        const userId = getUserId(subscription)
        if (!userId) break

        const { plan, credits } = getPlanFromProduct(subscription.product?.name || "")

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

        const userId = getUserId(subscription)
        if (!userId) break

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
    return new NextResponse("Internal server error", { status: 500 })
  }
}
