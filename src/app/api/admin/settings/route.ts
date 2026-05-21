import { NextResponse } from "next/server";

import { isAdminAuthenticatedRequest } from "@/lib/admin-request";
import { connectDb } from "@/lib/db";
import { defaultStoreSettings } from "@/lib/store-settings";
import { StoreSettings } from "@/models/StoreSettings";

export async function GET(req: Request) {
  if (!isAdminAuthenticatedRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbReady = await connectDb();
  if (!dbReady) {
    return NextResponse.json({ settings: defaultStoreSettings, mode: "seed" });
  }

  const settings = await StoreSettings.findOne({ key: "default" }).lean();
  return NextResponse.json({
    settings: settings ?? { key: "default", ...defaultStoreSettings },
    mode: "mongodb",
  });
}

export async function PUT(req: Request) {
  if (!isAdminAuthenticatedRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbReady = await connectDb();
  if (!dbReady) {
    return NextResponse.json({ error: "MongoDB is not configured." }, { status: 503 });
  }

  const updates = await req.json();
  const settings = await StoreSettings.findOneAndUpdate(
    { key: "default" },
    { $set: updates, $setOnInsert: { key: "default" } },
    { upsert: true, new: true },
  ).lean();

  return NextResponse.json({ settings });
}
