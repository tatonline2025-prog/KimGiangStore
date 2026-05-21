import { NextResponse } from "next/server";

import { connectDb } from "@/lib/db";
import { verifyTwoCheckoutSignature } from "@/lib/payments/twocheckout";
import { Order } from "@/models/Order";
import { Payment } from "@/models/Payment";

export async function POST(req: Request) {
  const dbReady = await connectDb();
  if (!dbReady) {
    return NextResponse.json({ error: "MongoDB is not configured" }, { status: 503 });
  }

  const signature = req.headers.get("x-2checkout-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing 2Checkout signature" }, { status: 400 });
  }

  const payload = await req.text();
  const verified = verifyTwoCheckoutSignature(payload, signature);
  if (!verified) {
    return NextResponse.json({ error: "Invalid 2Checkout signature" }, { status: 400 });
  }

  const data = JSON.parse(payload) as {
    orderId: string;
    providerRef: string;
    status: "paid" | "failed" | "refunded";
  };

  const nextOrderStatus = data.status === "paid" ? "paid" : data.status;

  await Order.findByIdAndUpdate(data.orderId, {
    paymentStatus: data.status,
    orderStatus: nextOrderStatus,
    paymentReference: data.providerRef,
  });

  await Payment.findOneAndUpdate(
    { orderId: data.orderId, provider: "twocheckout" },
    {
      status: data.status,
      providerRef: data.providerRef,
      signatureVerified: true,
      rawPayload: data,
    },
  );

  return NextResponse.json({ received: true });
}
