import { AdminPanel } from "@/components/AdminPanel";
import { getAdminSessionCookieName, parseAdminSessionToken } from "@/lib/admin-auth";
import { connectDb } from "@/lib/db";
import { defaultPages } from "@/lib/page-defaults";
import { seedProducts } from "@/lib/seed-data";
import { getStoreSettings } from "@/lib/store-settings";
import { Order } from "@/models/Order";
import { PageContent } from "@/models/PageContent";
import { Product } from "@/models/Product";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAdminSessionCookieName())?.value;
  const session = parseAdminSessionToken(token);

  if (!session) {
    redirect("/admin/login");
  }

  const dbReady = await connectDb();

  const [products, orders, pageDocs] = dbReady
    ? await Promise.all([
        Product.find().sort({ createdAt: -1 }).lean(),
        Order.find().sort({ createdAt: -1 }).limit(100).lean(),
        PageContent.find({}).lean(),
      ])
    : [seedProducts, [], []];

  const settings = await getStoreSettings();

  const pageDocsInDb = new Set(pageDocs.map((d: { key: string }) => d.key));
  const pages = [
    ...pageDocs,
    ...Object.entries(defaultPages)
      .filter(([key]) => !pageDocsInDb.has(key))
      .map(([key, def]) => ({ key, ...def })),
  ];

  return (
    <AdminPanel
      initialProducts={products.map((item) => ({ ...item, _id: String(item._id ?? (item as { slug: string }).slug) }))}
      initialOrders={orders.map((item) => ({ ...item, _id: String(item._id) }))}
      initialSettings={settings}
      initialPages={pages}
    />
  );
}
