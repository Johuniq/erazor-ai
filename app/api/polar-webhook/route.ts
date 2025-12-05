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

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const headers: Record<string, string> = {}
    
    req.headers.forEach((value, key) => {
      headers[key] = value
    })
    const event = validateEvent(
      body,
      headers,
      process.env.POLAR_WEBHOOK_SECRET ?? ""
    )
    switch (event.type) {
      case "checkout.created":
        break

      case "checkout.updated": {
        const checkout = event.data
        if (checkout.status === "succeeded") {
          const userId = getUserId(checkout)

          if (userId && checkout.product) {
            const { plan, credits } = getPlanFromProduct(checkout.product.name || "")

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
                console.error("Failed to update profile:", error)
            } else {

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

        const userId = getUserId(order)
        if (!userId) {
          console.error("No user_id found in order")
          break
        }

        const { plan, credits } = getPlanFromProduct(order.product?.name || "")

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

        await supabaseAdmin.from("credit_transactions").insert({
          user_id: userId,
          amount: credits,
          type: "purchase",
          description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} plan purchase`,
          reference_id: order.id,
        })

        break
      }

      case "subscription.created": {
        const subscription = event.data

        const userId = getUserId(subscription)
        if (!userId) {
          console.error("No user_id found in subscription")
          break
        }

        const { plan, credits } = getPlanFromProduct(subscription.product?.name || "")

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

        await supabaseAdmin.from("credit_transactions").insert({
          user_id: userId,
          amount: credits,
          type: "purchase",
          description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} plan subscription`,
          reference_id: subscription.id,
        })

        break
      }

      case "subscription.updated": {
        const subscription = event.data

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

        break
      }

      case "subscription.canceled": {
        const subscription = event.data

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
      console.error("Webhook verification failed:", error.message)
      return new NextResponse("Forbidden", { status: 403 })
    }
    console.error("Webhook error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

// Handle GET requests (for testing the endpoint exists)
export async function GET() {
  return new NextResponse("Polar webhook endpoint is active", { status: 200 })
}
