import { NextResponse } from "next/server";

import { connectDb } from "@/lib/db";
import { env } from "@/lib/env";
import { getStripeClient } from "@/lib/payments/stripe";
import { Order } from "@/models/Order";
import { Payment } from "@/models/Payment";

export async function POST(req: Request) {
  const dbReady = await connectDb();
  if (!dbReady) {
    return NextResponse.json({ error: "MongoDB is not configured" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature || !env.stripeWebhookSecret) {
    return NextResponse.json({ error: "Missing Stripe webhook configuration" }, { status: 400 });
  }

  const payload = await req.text();
  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, env.stripeWebhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        orderStatus: "paid",
        paymentReference: session.id,
      });

      await Payment.findOneAndUpdate(
        { orderId, provider: "stripe", providerRef: session.id },
        {
          status: "paid",
          signatureVerified: true,
          rawPayload: session,
        },
      );
    }
  }

  return NextResponse.json({ received: true });
}
