import { NextResponse } from "next/server";

import { connectDb } from "@/lib/db";
import { Product } from "@/models/Product";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const dbReady = await connectDb();
  if (!dbReady) {
    return NextResponse.json(
      { error: "MongoDB is not configured. Set MONGODB_URI first." },
      { status: 503 },
    );
  }

  const { id } = await context.params;
  const updates = await req.json();
  const product = await Product.findByIdAndUpdate(id, updates, { new: true }).lean();

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  const dbReady = await connectDb();
  if (!dbReady) {
    return NextResponse.json(
      { error: "MongoDB is not configured. Set MONGODB_URI first." },
      { status: 503 },
    );
  }

  const { id } = await context.params;
  const deleted = await Product.findByIdAndDelete(id).lean();

  if (!deleted) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
