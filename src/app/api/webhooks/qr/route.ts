import { NextResponse } from "next/server";

import { connectDb } from "@/lib/db";
import { verifyQrCallbackSignature } from "@/lib/payments/qr";
import { Order } from "@/models/Order";
import { Payment } from "@/models/Payment";

export async function POST(req: Request) {
  const dbReady = await connectDb();
  if (!dbReady) {
    return NextResponse.json({ error: "MongoDB is not configured" }, { status: 503 });
  }

  const signature = req.headers.get("x-qr-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing QR signature" }, { status: 400 });
  }

  const payload = await req.text();
  const verified = verifyQrCallbackSignature(payload, signature);
  if (!verified) {
    return NextResponse.json({ error: "Invalid QR signature" }, { status: 400 });
  }

  const data = JSON.parse(payload) as {
    orderId: string;
    transactionId: string;
    status: "paid" | "failed";
  };

  await Order.findByIdAndUpdate(data.orderId, {
    paymentStatus: data.status,
    orderStatus: data.status,
    paymentReference: data.transactionId,
  });

  await Payment.findOneAndUpdate(
    { orderId: data.orderId, provider: "qr" },
    {
      status: data.status,
      providerRef: data.transactionId,
      signatureVerified: true,
      rawPayload: data,
    },
  );

  return NextResponse.json({ received: true });
}
