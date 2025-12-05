import { Polar } from "@polar-sh/sdk"
import { NextResponse } from "next/server"

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: "sandbox",
})

export async function GET() {
  try {
    const result = await polar.products.list({
      limit: 100,
      isArchived: false,
    })

    const products = result.result.items.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      isRecurring: product.isRecurring,
      prices: product.prices.map((price) => ({
        id: price.id,
        type: price.type,
        amountType: price.amountType,
        priceAmount: price.amountType === "fixed" ? price.priceAmount : null,
        priceCurrency: price.amountType === "fixed" ? price.priceCurrency : null,
        recurringInterval: price.type === "recurring" ? price.recurringInterval : null,
      })),
      benefits: product.benefits.map((benefit) => ({
        id: benefit.id,
        description: benefit.description,
        type: benefit.type,
      })),
    }))

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}