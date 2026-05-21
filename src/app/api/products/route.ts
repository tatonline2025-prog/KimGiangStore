import { NextResponse } from "next/server";

import { connectDb } from "@/lib/db";
import { seedProducts } from "@/lib/seed-data";
import { Product } from "@/models/Product";

export async function GET() {
  const dbReady = await connectDb();
  if (!dbReady) {
    return NextResponse.json({ products: seedProducts, mode: "seed" });
  }

  const products = await Product.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ products, mode: "mongodb" });
}

export async function POST(req: Request) {
  const dbReady = await connectDb();
  if (!dbReady) {
    return NextResponse.json(
      { error: "MongoDB is not configured. Set MONGODB_URI first." },
      { status: 503 },
    );
  }

  const body = await req.json();
  const requiredFields = [
    "name",
    "slug",
    "dynasty",
    "priceUsd",
    "imageUrl",
    "shortDescription",
    "longDescription",
    "provenanceCode",
  ];

  for (const field of requiredFields) {
    if (!body[field]) {
      return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
    }
  }

  const product = await Product.create(body);
  return NextResponse.json({ product }, { status: 201 });
}
