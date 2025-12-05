import { createClient } from "@/lib/supabase/server"
import { Polar } from "@polar-sh/sdk"
import { type NextRequest, NextResponse } from "next/server"

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: "production", // Change to "production" when going live
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

    if (!productId) {
      return NextResponse.json({ message: "Product ID required" }, { status: 400 })
    }

    // Get user email from profile
    const { data: profile } = await supabase.from("profiles").select("email").eq("id", user.id).single()

    // Get the origin for success/confirmation URLs
    const origin = request.headers.get("origin") || request.nextUrl.origin

    // Create checkout session directly with Polar SDK
    const checkout = await polar.checkouts.create({
      products: [productId!],
      customerEmail: profile?.email || user.email || undefined,
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
