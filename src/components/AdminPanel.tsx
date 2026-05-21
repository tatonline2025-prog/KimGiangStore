"use client";

import { useRouter } from "next/navigation";
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

type StoreSettings = {
  storeName: string;
  menuItems: string[];
  heroTitle: string;
  heroSubtitle: string;
  treasuryTitle: string;
  provenanceTitle: string;
  provenanceDescription: string;
  paymentLabels: string[];
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  allowStripe: boolean;
  allowTwoCheckout: boolean;
  allowQr: boolean;
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
  initialSettings,
}: {
  initialProducts: Product[];
  initialOrders: Order[];
  initialSettings: StoreSettings;
}) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);
  const [form, setForm] = useState(initialForm);
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "settings">("products");
  const [status, setStatus] = useState<string>("");

  async function loadData() {
    const [productRes, orderRes, settingsRes] = await Promise.all([
      fetch("/api/products", { cache: "no-store" }),
      fetch("/api/admin/orders", { cache: "no-store" }),
      fetch("/api/admin/settings", { cache: "no-store" }),
    ]);

    const productData = await productRes.json();
    const orderData = await orderRes.json();
    const settingsData = await settingsRes.json();

    setProducts(productData.products ?? []);
    setOrders(orderData.orders ?? []);
    setSettings(settingsData.settings ?? initialSettings);
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

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");

    const payload = {
      ...settings,
      menuItems: settings.menuItems.filter((item) => item.trim()),
      paymentLabels: settings.paymentLabels.filter((item) => item.trim()),
    };

    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      setStatus(data.error ?? "Unable to save settings");
      return;
    }

    setSettings(data.settings);
    setStatus("Settings saved");
  }

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#0f131b] px-6 py-8 text-[#f4f6fa]">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold">KimGiang Admin Panel</h1>
            <p className="mt-2 text-sm text-slate-300">Manage products, monitor orders, and configure store settings.</p>
          </div>
          <button
            onClick={logout}
            className="border border-slate-500 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
          >
            Logout
          </button>
        </div>

        <div className="mt-6 rounded-lg border border-slate-700 bg-slate-900/60 p-5 text-xs text-amber-300">
          Security note: admin access is protected by login session. Add MFA in a later phase.
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-3 py-2 text-sm ${activeTab === "products" ? "bg-cyan-500 text-black" : "bg-slate-800"}`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-3 py-2 text-sm ${activeTab === "orders" ? "bg-cyan-500 text-black" : "bg-slate-800"}`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-3 py-2 text-sm ${activeTab === "settings" ? "bg-cyan-500 text-black" : "bg-slate-800"}`}
          >
            Store Settings
          </button>
        </div>

        {activeTab === "products" ? (
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
        ) : null}

        {activeTab === "orders" ? (
          <section className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-5">
            <h2 className="text-xl">Recent Orders</h2>
            <div className="mt-4 grid gap-3">
              {orders.length === 0 ? <p className="text-sm text-slate-400">No orders yet.</p> : null}
              {orders.map((order) => (
                <div key={order._id} className="rounded-md border border-slate-700 bg-slate-800/60 p-3 text-sm">
                  <p>{order.customerName} ({order.customerEmail})</p>
                  <p>Total: ${order.totalUsd.toLocaleString("en-US")} - {order.paymentMethod}</p>
                  <p>Status: {order.orderStatus} / {order.paymentStatus}</p>
                  <p className="text-slate-400">{new Date(order.createdAt).toLocaleString("en-US")}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {activeTab === "settings" ? (
          <section className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-5">
            <h2 className="text-xl">Store Settings</h2>
            <form onSubmit={saveSettings} className="mt-4 grid gap-3 md:grid-cols-2">
              <input className="bg-slate-800 px-3 py-2" placeholder="Store Name" value={settings.storeName} onChange={(e) => setSettings((prev) => ({ ...prev, storeName: e.target.value }))} />
              <input className="bg-slate-800 px-3 py-2" placeholder="Treasury Title" value={settings.treasuryTitle} onChange={(e) => setSettings((prev) => ({ ...prev, treasuryTitle: e.target.value }))} />
              <textarea className="bg-slate-800 px-3 py-2 md:col-span-2" placeholder="Hero Title" value={settings.heroTitle} onChange={(e) => setSettings((prev) => ({ ...prev, heroTitle: e.target.value }))} />
              <textarea className="bg-slate-800 px-3 py-2 md:col-span-2" placeholder="Hero Subtitle" value={settings.heroSubtitle} onChange={(e) => setSettings((prev) => ({ ...prev, heroSubtitle: e.target.value }))} />
              <input className="bg-slate-800 px-3 py-2" placeholder="Contact Email" value={settings.contactEmail} onChange={(e) => setSettings((prev) => ({ ...prev, contactEmail: e.target.value }))} />
              <input className="bg-slate-800 px-3 py-2" placeholder="Contact Phone" value={settings.contactPhone} onChange={(e) => setSettings((prev) => ({ ...prev, contactPhone: e.target.value }))} />
              <input className="bg-slate-800 px-3 py-2 md:col-span-2" placeholder="Contact Address" value={settings.contactAddress} onChange={(e) => setSettings((prev) => ({ ...prev, contactAddress: e.target.value }))} />
              <input className="bg-slate-800 px-3 py-2 md:col-span-2" placeholder="Provenance Title" value={settings.provenanceTitle} onChange={(e) => setSettings((prev) => ({ ...prev, provenanceTitle: e.target.value }))} />
              <input className="bg-slate-800 px-3 py-2" placeholder="Menu Items (comma separated)" value={settings.menuItems.join(", ")} onChange={(e) => setSettings((prev) => ({ ...prev, menuItems: e.target.value.split(",").map((item) => item.trim()) }))} />
              <input className="bg-slate-800 px-3 py-2" placeholder="Payment Labels (comma separated)" value={settings.paymentLabels.join(", ")} onChange={(e) => setSettings((prev) => ({ ...prev, paymentLabels: e.target.value.split(",").map((item) => item.trim()) }))} />
              <input className="bg-slate-800 px-3 py-2" placeholder="Instagram URL" value={settings.instagramUrl} onChange={(e) => setSettings((prev) => ({ ...prev, instagramUrl: e.target.value }))} />
              <input className="bg-slate-800 px-3 py-2" placeholder="Facebook URL" value={settings.facebookUrl} onChange={(e) => setSettings((prev) => ({ ...prev, facebookUrl: e.target.value }))} />
              <input className="bg-slate-800 px-3 py-2 md:col-span-2" placeholder="TikTok URL" value={settings.tiktokUrl} onChange={(e) => setSettings((prev) => ({ ...prev, tiktokUrl: e.target.value }))} />
              <textarea className="bg-slate-800 px-3 py-2 md:col-span-2" placeholder="Provenance Description" value={settings.provenanceDescription} onChange={(e) => setSettings((prev) => ({ ...prev, provenanceDescription: e.target.value }))} />

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={settings.allowStripe} onChange={(e) => setSettings((prev) => ({ ...prev, allowStripe: e.target.checked }))} />
                Enable Stripe
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={settings.allowTwoCheckout} onChange={(e) => setSettings((prev) => ({ ...prev, allowTwoCheckout: e.target.checked }))} />
                Enable 2Checkout
              </label>
              <label className="flex items-center gap-2 text-sm md:col-span-2">
                <input type="checkbox" checked={settings.allowQr} onChange={(e) => setSettings((prev) => ({ ...prev, allowQr: e.target.checked }))} />
                Enable QR Transfer
              </label>

              <button className="mt-2 bg-cyan-500 px-4 py-2 font-semibold text-black md:col-span-2">Save Settings</button>
              {status ? <p className="text-sm text-amber-300 md:col-span-2">{status}</p> : null}
            </form>
          </section>
        ) : null}
      </div>
    </div>
  );
}
