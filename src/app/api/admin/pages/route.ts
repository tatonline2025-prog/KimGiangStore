import { NextResponse } from "next/server";

import { isAdminAuthenticatedRequest } from "@/lib/admin-request";
import { connectDb } from "@/lib/db";
import { defaultPages } from "@/lib/page-defaults";
import { PageContent } from "@/models/PageContent";

export async function GET(req: Request) {
  if (!isAdminAuthenticatedRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbReady = await connectDb();
  if (!dbReady) {
    const pages = Object.entries(defaultPages).map(([key, def]) => ({
      key,
      ...def,
    }));
    return NextResponse.json({ pages, mode: "seed" });
  }

  const docs = await PageContent.find({}).lean();
  const keysInDb = new Set(docs.map((d: { key: string }) => d.key));

  const merged = [
    ...docs,
    ...Object.entries(defaultPages)
      .filter(([key]) => !keysInDb.has(key))
      .map(([key, def]) => ({ key, ...def })),
  ];

  return NextResponse.json({ pages: merged, mode: "mongodb" });
}

export async function PUT(req: Request) {
  if (!isAdminAuthenticatedRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbReady = await connectDb();
  if (!dbReady) {
    return NextResponse.json({ error: "MongoDB is not configured." }, { status: 503 });
  }

  const { key, title, subtitle, body } = await req.json();
  if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });

  const page = await PageContent.findOneAndUpdate(
    { key },
    { $set: { title, subtitle, body } },
    { upsert: true, new: true },
  ).lean();

  return NextResponse.json({ page });
}
