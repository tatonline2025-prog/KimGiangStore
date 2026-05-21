import Stripe from "stripe";

import { env } from "@/lib/env";

export function getStripeClient() {
  if (!env.stripeSecretKey) {
    return null;
  }

  return new Stripe(env.stripeSecretKey, {
    apiVersion: "2026-04-22.dahlia",
  });
}

export async function createStripeCheckoutSession(params: {
  orderId: string;
  productName: string;
  amountUsd: number;
}) {
  const stripe = getStripeClient();
  if (!stripe) {
    return {
      providerRef: `stripe_mock_${params.orderId}`,
      checkoutUrl: `${env.baseUrl}/checkout/simulated?provider=stripe&order=${params.orderId}`,
      mockMode: true,
    };
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          product_data: { name: params.productName },
          unit_amount: Math.round(params.amountUsd * 100),
        },
      },
    ],
    success_url: `${env.baseUrl}/checkout/success?order=${params.orderId}`,
    cancel_url: `${env.baseUrl}/checkout/cancel?order=${params.orderId}`,
    metadata: {
      orderId: params.orderId,
    },
  });

  return {
    providerRef: session.id,
    checkoutUrl: session.url ?? `${env.baseUrl}/checkout/pending?order=${params.orderId}`,
    mockMode: false,
  };
}
