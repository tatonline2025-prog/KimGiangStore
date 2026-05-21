import { NextResponse } from "next/server";

import { connectDb } from "@/lib/db";
import { defaultPages } from "@/lib/page-defaults";
import { PageContent } from "@/models/PageContent";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;
  const dbReady = await connectDb();

  if (!dbReady) {
    const def = defaultPages[key];
    if (!def) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ page: { key, ...def }, mode: "seed" });
  }

  const page = await PageContent.findOne({ key }).lean();
  const def = defaultPages[key];

  if (!page && !def) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ page: page ?? { key, ...def }, mode: "mongodb" });
}
