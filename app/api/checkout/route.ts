import { createClient } from "@/lib/supabase/server"
import { Polar } from "@polar-sh/sdk"
import { type NextRequest, NextResponse } from "next/server"

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: "sandbox",
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

    // Get the origin for success/confirmation URLs
    const origin = request.headers.get("origin") || request.nextUrl.origin

    // If we have a priceId, we need to find the product ID for that price
    let productIdToUse = productId

    if (priceId && !productId) {
      // Fetch products to find the one with this price
      const productsResult = await polar.products.list({
        limit: 100,
        isArchived: false,
      })

      for (const product of productsResult.result.items) {
        const hasPrice = product.prices.some((p) => p.id === priceId)
        if (hasPrice) {
          productIdToUse = product.id
          break
        }
      }
    }

    if (!productIdToUse) {
      console.error("Could not find product for priceId:", priceId)
      return NextResponse.redirect(`${origin}/dashboard/billing?error=checkout_failed`)
    }

    // Create checkout session with Polar SDK
    const checkout = await polar.checkouts.create({
      products: [productIdToUse],
      metadata: {
        user_id: user.id,
      },
      successUrl: `${origin}/dashboard/billing?success=true`,
    })

    // Redirect to Polar checkout
    return NextResponse.redirect(checkout.url)
  } catch (error) {
    console.error("Checkout error:", error)
    const origin = request.headers.get("origin") || request.nextUrl.origin
    return NextResponse.redirect(`${origin}/dashboard/billing?error=checkout_failed`)
  }
}
