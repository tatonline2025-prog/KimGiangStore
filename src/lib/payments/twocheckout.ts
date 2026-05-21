import crypto from "crypto";

import { env } from "@/lib/env";

function signPayload(payload: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export function verifyTwoCheckoutSignature(payload: string, signature: string) {
  if (!env.twoCheckoutWebhookSecret) {
    return false;
  }

  const expected = signPayload(payload, env.twoCheckoutWebhookSecret);
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export function createTwoCheckoutSession(params: {
  orderId: string;
  amountUsd: number;
  customerEmail: string;
}) {
  if (!env.twoCheckoutSellerId || !env.twoCheckoutSecretKey) {
    return {
      providerRef: `2co_mock_${params.orderId}`,
      checkoutUrl: `${env.baseUrl}/checkout/simulated?provider=2checkout&order=${params.orderId}`,
      mockMode: true,
    };
  }

  const payload = `${params.orderId}:${params.amountUsd}:${params.customerEmail}`;
  const signature = signPayload(payload, env.twoCheckoutSecretKey);

  const checkoutUrl =
    `https://secure.2checkout.com/checkout/purchase?merchant=${env.twoCheckoutSellerId}` +
    `&order_ext_ref=${params.orderId}` +
    `&currency=USD&total=${params.amountUsd}` +
    `&email=${encodeURIComponent(params.customerEmail)}` +
    `&signature=${signature}`;

  return {
    providerRef: `2co_${params.orderId}`,
    checkoutUrl,
    mockMode: false,
  };
}
