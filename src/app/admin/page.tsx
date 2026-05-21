import { AdminPanel } from "@/components/AdminPanel";
import { connectDb } from "@/lib/db";
import { seedProducts } from "@/lib/seed-data";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

export default async function AdminPage() {
  const dbReady = await connectDb();

  const [products, orders] = dbReady
    ? await Promise.all([
        Product.find().sort({ createdAt: -1 }).lean(),
        Order.find().sort({ createdAt: -1 }).limit(100).lean(),
      ])
    : [seedProducts, []];

  return (
    <AdminPanel
      initialProducts={products.map((item) => ({ ...item, _id: String(item._id ?? item.slug) }))}
      initialOrders={orders.map((item) => ({ ...item, _id: String(item._id) }))}
    />
  );
}
