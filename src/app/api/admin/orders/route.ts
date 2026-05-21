import { NextResponse } from "next/server";

import { isAdminAuthenticatedRequest } from "@/lib/admin-request";
import { connectDb } from "@/lib/db";
import { Order } from "@/models/Order";

export async function GET(req: Request) {
  if (!isAdminAuthenticatedRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbReady = await connectDb();
  if (!dbReady) {
    return NextResponse.json({ orders: [], mode: "seed", warning: "Configure MongoDB for live orders." });
  }

  const orders = await Order.find().sort({ createdAt: -1 }).limit(100).lean();
  return NextResponse.json({ orders, mode: "mongodb" });
}
