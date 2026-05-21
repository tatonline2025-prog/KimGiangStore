"use client";

import { FormEvent, useState } from "react";

type Product = {
  _id: string;
  name: string;
  slug: string;
  dynasty: string;
  priceUsd: number;
  imageUrl: string;
  shortDescription: string;
  longDescription: string;
  provenanceCode: string;
};

type Order = {
  _id: string;
  customerName: string;
  customerEmail: string;
  paymentMethod: string;
  orderStatus: string;
  paymentStatus: string;
  totalUsd: number;
  createdAt: string;
};

const initialForm = {
  name: "",
  slug: "",
  dynasty: "",
  priceUsd: 0,
  imageUrl: "",
  shortDescription: "",
  longDescription: "",
  provenanceCode: "",
};

export function AdminPanel({
  initialProducts,
  initialOrders,
}: {
  initialProducts: Product[];
  initialOrders: Order[];
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<string>("");

  async function loadData() {
    const [productRes, orderRes] = await Promise.all([
      fetch("/api/products", { cache: "no-store" }),
      fetch("/api/admin/orders", { cache: "no-store" }),
    ]);

    const productData = await productRes.json();
    const orderData = await orderRes.json();

    setProducts(productData.products ?? []);
    setOrders(orderData.orders ?? []);
  }

  async function submitProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error ?? "Failed to create product");
      return;
    }

    setStatus("Product created");
    setForm(initialForm);
    await loadData();
  }

  async function deleteProduct(id: string) {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      await loadData();
    }
  }

  return (
    <div className="min-h-screen bg-[#0f131b] px-6 py-8 text-[#f4f6fa]">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold">KimGiang Admin Panel</h1>
        <p className="mt-2 text-sm text-slate-300">Manage products, monitor orders, and inspect payment status.</p>

        <div className="mt-6 rounded-lg border border-slate-700 bg-slate-900/60 p-5 text-xs text-amber-300">
          Security note: production setup should protect this route with RBAC + MFA.
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <section className="rounded-xl border border-slate-700 bg-slate-900 p-5">
            <h2 className="text-xl">Create Product</h2>
            <form onSubmit={submitProduct} className="mt-4 grid gap-2">
              <input className="bg-slate-800 px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
              <input className="bg-slate-800 px-3 py-2" placeholder="Slug" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} />
              <input className="bg-slate-800 px-3 py-2" placeholder="Dynasty" value={form.dynasty} onChange={(e) => setForm((p) => ({ ...p, dynasty: e.target.value }))} />
              <input className="bg-slate-800 px-3 py-2" type="number" placeholder="Price USD" value={form.priceUsd} onChange={(e) => setForm((p) => ({ ...p, priceUsd: Number(e.target.value) }))} />
              <input className="bg-slate-800 px-3 py-2" placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))} />
              <input className="bg-slate-800 px-3 py-2" placeholder="Short Description" value={form.shortDescription} onChange={(e) => setForm((p) => ({ ...p, shortDescription: e.target.value }))} />
              <textarea className="bg-slate-800 px-3 py-2" placeholder="Long Description" value={form.longDescription} onChange={(e) => setForm((p) => ({ ...p, longDescription: e.target.value }))} />
              <input className="bg-slate-800 px-3 py-2" placeholder="Provenance Code" value={form.provenanceCode} onChange={(e) => setForm((p) => ({ ...p, provenanceCode: e.target.value }))} />

              <button className="mt-2 bg-cyan-500 px-4 py-2 font-semibold text-black">Save Product</button>
              {status ? <p className="text-sm text-amber-300">{status}</p> : null}
            </form>
          </section>

          <section className="rounded-xl border border-slate-700 bg-slate-900 p-5">
            <h2 className="text-xl">Recent Orders</h2>
            <div className="mt-4 grid gap-3">
              {orders.length === 0 ? <p className="text-sm text-slate-400">No orders yet.</p> : null}
              {orders.map((order) => (
                <div key={order._id} className="rounded-md border border-slate-700 bg-slate-800/60 p-3 text-sm">
                  <p>{order.customerName} ({order.customerEmail})</p>
                  <p>Total: ${order.totalUsd.toLocaleString("en-US")} - {order.paymentMethod}</p>
                  <p>Status: {order.orderStatus} / {order.paymentStatus}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-5">
          <h2 className="text-xl">Product Inventory</h2>
          <div className="mt-4 grid gap-3">
            {products.map((product) => (
              <div key={product._id ?? product.slug} className="flex items-center justify-between rounded-md border border-slate-700 bg-slate-800/60 p-3">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-slate-300">{product.dynasty} - ${product.priceUsd.toLocaleString("en-US")}</p>
                </div>
                {product._id ? (
                  <button className="border border-rose-400 px-3 py-1 text-rose-300" onClick={() => deleteProduct(product._id)}>
                    Delete
                  </button>
                ) : (
                  <span className="text-xs text-slate-400">Seed item</span>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
