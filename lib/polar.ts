import { Polar } from "@polar-sh/sdk"

export const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: "sandbox", // Change to "production" when going live
})

export async function createCheckoutSession(
  productId: string,
  customerEmail: string,
  userId: string,
  successUrl: string,
) {
  const checkout = await polar.checkouts.create({
    products: [productId],
    customerEmail,
    successUrl,
    metadata: {
      user_id: userId,
    },
  })

  return checkout
}

export async function getSubscription(subscriptionId: string) {
  const subscription = await polar.subscriptions.get({ id: subscriptionId })
  return subscription
}

export async function cancelSubscription(subscriptionId: string) {
  const subscription = await polar.subscriptions.cancel({ id: subscriptionId })
  return subscription
}
