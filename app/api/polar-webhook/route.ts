import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks"
import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

// Use service role for webhook handling (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
  // Check external customer id
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

// Disable body parsing - we need raw body for signature verification
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    // Log the request for debugging
    console.log("[Webhook] Received request:", {
      method: req.method,
      url: req.url,
      headers: Object.fromEntries(req.headers.entries()),
    })

    const body = await req.text()
    const headers: Record<string, string> = {}
    
    req.headers.forEach((value, key) => {
      headers[key] = value
    })

    console.log("[Webhook] Validating event with secret:", process.env.POLAR_WEBHOOK_SECRET ? "Set" : "Not set")
    
    const event = validateEvent(
      body,
      headers,
      process.env.POLAR_WEBHOOK_SECRET ?? ""
    )

    console.log("[Webhook] Event validated:", event.type)
    switch (event.type) {
      case "checkout.created":
        console.log("[Webhook] Checkout created:", event.data.id)
        break

      case "checkout.updated": {
        console.log("[Webhook] Checkout updated:", event.data.id, "Status:", event.data.status)
        const checkout = event.data
        if (checkout.status === "succeeded") {
          const userId = getUserId(checkout)
          console.log("[Webhook] Processing successful checkout for user:", userId)

          if (userId && checkout.product) {
            const { plan, credits } = getPlanFromProduct(checkout.product.name || "")
            console.log("[Webhook] Applying plan:", plan, "Credits:", credits)

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
                console.error("[Webhook] Failed to update profile:", error)
            } else {
              console.log("[Webhook] Profile updated successfully")

              await supabaseAdmin.from("credit_transactions").insert({
                user_id: userId,
                amount: credits,
                type: "purchase",
                description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} plan purchase`,
                reference_id: checkout.id,
              })
              console.log("[Webhook] Credit transaction recorded")
            }
          }
        }
        break
      }

      case "order.created": {
        console.log("[Webhook] Order created:", event.data.id)
        const order = event.data

        const userId = getUserId(order)
        if (!userId) {
          console.error("[Webhook] No user_id found in order")
          break
        }
        console.log("[Webhook] Processing order for user:", userId)

        const { plan, credits } = getPlanFromProduct(order.product?.name || "")
        console.log("[Webhook] Applying plan:", plan, "Credits:", credits)

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
          console.error("[Webhook] Failed to update profile:", error)
          break
        }
        console.log("[Webhook] Profile updated successfully")

        await supabaseAdmin.from("credit_transactions").insert({
          user_id: userId,
          amount: credits,
          type: "purchase",
          description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} plan purchase`,
          reference_id: order.id,
        })
        console.log("[Webhook] Credit transaction recorded")

        break
      }

      case "subscription.created": {
        console.log("[Webhook] Subscription created:", event.data.id)
        const subscription = event.data

        const userId = getUserId(subscription)
        if (!userId) {
          console.error("[Webhook] No user_id found in subscription")
          break
        }
        console.log("[Webhook] Processing subscription for user:", userId)

        const { plan, credits } = getPlanFromProduct(subscription.product?.name || "")
        console.log("[Webhook] Applying plan:", plan, "Credits:", credits)

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
          console.error("[Webhook] Failed to update profile:", error)
          break
        }
        console.log("[Webhook] Profile updated successfully")

        await supabaseAdmin.from("credit_transactions").insert({
          user_id: userId,
          amount: credits,
          type: "purchase",
          description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} plan subscription`,
          reference_id: subscription.id,
        })
        console.log("[Webhook] Credit transaction recorded")

        break
      }

      case "subscription.updated": {
        console.log("[Webhook] Subscription updated:", event.data.id)
        const subscription = event.data

        const userId = getUserId(subscription)
        if (!userId) {
          console.log("[Webhook] No user_id found in subscription update")
          break
        }

        const { plan, credits } = getPlanFromProduct(subscription.product?.name || "")
        console.log("[Webhook] Updating to plan:", plan, "Credits:", credits)

        await supabaseAdmin
          .from("profiles")
          .update({
            plan,
            credits,
            polar_subscription_id: subscription.id,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)

        console.log("[Webhook] Subscription updated for user:", userId)
        break
      }

      case "subscription.canceled": {
        console.log("[Webhook] Subscription canceled:", event.data.id)
        const subscription = event.data

        const userId = getUserId(subscription)
        if (!userId) {
          console.log("[Webhook] No user_id found in subscription cancellation")
          break
        }

        await supabaseAdmin
          .from("profiles")
          .update({
            plan: "free",
            polar_subscription_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)

        console.log("[Webhook] Subscription canceled for user:", userId)
        break
      }

      default: {
        // Handle meter credit balance changes and other events not in SDK types
        const eventType = event.type as string
        const eventData = event.data as any

        if (eventType === "customer_meter.credit_balance_changed") {
          console.log("Customer meter credit balance changed:", eventData)

          // Get customer external ID (user_id)
          const userId = eventData.customer?.externalId || eventData.customer?.metadata?.user_id
          if (!userId) {
            console.error("No user_id found in meter event")
            break
          }

          // Update user credits based on meter balance
          const balance = eventData.balance ?? (eventData.credited_units - eventData.consumed_units)

          if (typeof balance === "number") {
            await supabaseAdmin
              .from("profiles")
              .update({
                credits: Math.max(0, balance),
                updated_at: new Date().toISOString(),
              })
              .eq("id", userId)

            console.log(`Updated user ${userId} credits to ${balance}`)
          }
        } else {
          console.log("Unhandled event type:", eventType)
        }
        break
      }
    }

    return new NextResponse("OK", { status: 200 })
  } catch (error) {
    if (error instanceof WebhookVerificationError) {
      console.error("[Webhook] Verification failed:", error.message)
      return new NextResponse("Forbidden", { status: 403 })
    }
    console.error("[Webhook] Error processing webhook:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

// Handle GET requests (for testing the endpoint exists)
export async function GET() {
  return new NextResponse("Polar webhook endpoint is active", { status: 200 })
}
