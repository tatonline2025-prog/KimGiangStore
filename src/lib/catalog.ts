import { connectDb } from "@/lib/db";
import { seedProducts } from "@/lib/seed-data";
import { Product } from "@/models/Product";

export async function getCatalogProducts() {
  const dbReady = await connectDb();
  if (!dbReady) {
    return seedProducts;
  }

  const products = await Product.find({ active: true }).sort({ createdAt: -1 }).lean();
  if (!products.length) {
    return seedProducts;
  }

  return products.map((item) => ({
    ...item,
    _id: String(item._id),
  }));
}
