import { NextResponse } from "next/server";

import { connectDb } from "@/lib/db";
import { createQrSession } from "@/lib/payments/qr";
import { createStripeCheckoutSession } from "@/lib/payments/stripe";
import { createTwoCheckoutSession } from "@/lib/payments/twocheckout";
import { Order } from "@/models/Order";
import { Payment } from "@/models/Payment";

type CheckoutBody = {
  customerName: string;
  customerEmail: string;
  paymentMethod: "stripe" | "twocheckout" | "qr";
  item: {
    productId: string;
    name: string;
    priceUsd: number;
    quantity: number;
  };
};

export async function POST(req: Request) {
  const dbReady = await connectDb();
  if (!dbReady) {
    return NextResponse.json(
      { error: "MongoDB is not configured. Set MONGODB_URI first." },
      { status: 503 },
    );
  }

  const body = (await req.json()) as CheckoutBody;
  if (!body.customerName || !body.customerEmail || !body.paymentMethod || !body.item) {
    return NextResponse.json({ error: "Invalid checkout payload" }, { status: 400 });
  }

  const totalUsd = body.item.priceUsd * body.item.quantity;

  const order = await Order.create({
    customerName: body.customerName,
    customerEmail: body.customerEmail,
    paymentMethod: body.paymentMethod,
    items: [body.item],
    totalUsd,
  });

  if (body.paymentMethod === "stripe") {
    const session = await createStripeCheckoutSession({
      orderId: String(order._id),
      productName: body.item.name,
      amountUsd: totalUsd,
    });

    await Payment.create({
      orderId: String(order._id),
      provider: "stripe",
      providerRef: session.providerRef,
      amountUsd: totalUsd,
      status: "pending",
      rawPayload: session,
    });

    return NextResponse.json({
      orderId: String(order._id),
      provider: "stripe",
      checkoutUrl: session.checkoutUrl,
      mode: session.mockMode ? "mock" : "live",
    });
  }

  if (body.paymentMethod === "twocheckout") {
    const session = createTwoCheckoutSession({
      orderId: String(order._id),
      amountUsd: totalUsd,
      customerEmail: body.customerEmail,
    });

    await Payment.create({
      orderId: String(order._id),
      provider: "twocheckout",
      providerRef: session.providerRef,
      amountUsd: totalUsd,
      status: "pending",
      rawPayload: session,
    });

    return NextResponse.json({
      orderId: String(order._id),
      provider: "twocheckout",
      checkoutUrl: session.checkoutUrl,
      mode: session.mockMode ? "mock" : "live",
    });
  }

  const session = await createQrSession({
    orderId: String(order._id),
    amountUsd: totalUsd,
  });

  await Payment.create({
    orderId: String(order._id),
    provider: "qr",
    providerRef: session.providerRef,
    amountUsd: totalUsd,
    status: "pending",
    rawPayload: {
      transferContent: session.transferContent,
    },
  });

  return NextResponse.json({
    orderId: String(order._id),
    provider: "qr",
    qrDataUrl: session.qrDataUrl,
    transferContent: session.transferContent,
    mode: "live",
  });
}
