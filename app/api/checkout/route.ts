import { createClient } from "@/lib/supabase/server"
import { Polar } from "@polar-sh/sdk"
import { type NextRequest, NextResponse } from "next/server"

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: "production",
})

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("product")
    const priceId = searchParams.get("priceId")

    if (!productId && !priceId) {
      return NextResponse.json({ message: "Product ID or Price ID required" }, { status: 400 })
    }

    // Get user email from profile
    const { data: profile } = await supabase.from("profiles").select("email").eq("id", user.id).single()

    // Get the origin for success/confirmation URLs
    const origin = request.headers.get("origin") || request.nextUrl.origin

    // Create checkout session with Polar SDK
    // Use priceId if provided, otherwise use productId
    const checkoutConfig: Parameters<typeof polar.checkouts.create>[0] = {
      customerEmail: profile?.email || user.email || undefined,
      metadata: {
        user_id: user.id,
      },
      successUrl: `${origin}/dashboard/billing?success=true`,
      products: []
    }

    if (priceId) {
      // @ts-ignore - Polar SDK supports productPriceId
      checkoutConfig.productPriceId = priceId
    } else if (productId) {
      checkoutConfig.products = [productId]
    }

    const checkout = await polar.checkouts.create(checkoutConfig)

    // Redirect to Polar checkout
    return NextResponse.redirect(checkout.url)
  } catch (error) {
    console.error("Checkout error:", error)
    const origin = request.headers.get("origin") || request.nextUrl.origin
    return NextResponse.redirect(`${origin}/dashboard/billing?error=checkout_failed`)
  }
}
