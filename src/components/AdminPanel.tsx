"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

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
  stripePublicKey: string;
  stripeWebhookEndpoint: string;
  twoCheckoutSellerId: string;
  twoCheckoutWebhookEndpoint: string;
  qrProviderName: string;
  qrCallbackEndpoint: string;
  qrBankBin: string;
  qrBankAccount: string;
  qrAccountName: string;
};

type MenuKey = "products" | "orders" | "store" | "payments";

const blankProduct: Product = {
  _id: "",
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
  const [activeMenu, setActiveMenu] = useState<MenuKey>("products");
  const [selectedProductId, setSelectedProductId] = useState(initialProducts[0]?._id ?? "");
  const [selectedOrderId, setSelectedOrderId] = useState(initialOrders[0]?._id ?? "");
  const [productDraft, setProductDraft] = useState<Product>(
    initialProducts[0] ?? blankProduct,
  );
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [status, setStatus] = useState<string>("");

  const selectedOrder = useMemo(
    () => orders.find((order) => order._id === selectedOrderId),
    [orders, selectedOrderId],
  );

  async function loadData() {
    const [productRes, orderRes, settingsRes] = await Promise.all([
      fetch("/api/products", { cache: "no-store" }),
      fetch("/api/admin/orders", { cache: "no-store" }),
      fetch("/api/admin/settings", { cache: "no-store" }),
    ]);

    const productData = await productRes.json();
    const orderData = await orderRes.json();
    const settingsData = await settingsRes.json();

    const nextProducts = productData.products ?? [];
    const nextOrders = orderData.orders ?? [];

    setProducts(nextProducts);
    setOrders(nextOrders);
    setSettings(settingsData.settings ?? initialSettings);

    if (nextProducts.length > 0 && !nextProducts.find((item: Product) => item._id === selectedProductId)) {
      setSelectedProductId(nextProducts[0]._id);
      setProductDraft(nextProducts[0]);
    }

    if (nextOrders.length > 0 && !nextOrders.find((item: Order) => item._id === selectedOrderId)) {
      setSelectedOrderId(nextOrders[0]._id);
    }
  }

  function startCreateProduct() {
    setIsCreatingProduct(true);
    setSelectedProductId("");
    setProductDraft(blankProduct);
    setStatus("");
  }

  function selectProduct(product: Product) {
    setIsCreatingProduct(false);
    setSelectedProductId(product._id);
    setProductDraft(product);
    setStatus("");
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");

    const isNew = isCreatingProduct || !selectedProductId;
    const url = isNew ? "/api/products" : `/api/products/${selectedProductId}`;
    const method = isNew ? "POST" : "PUT";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productDraft),
    });

    const data = await response.json();
    if (!response.ok) {
      setStatus(data.error ?? "Unable to save product");
      return;
    }

    setStatus(isNew ? "Product created" : "Product updated");
    setIsCreatingProduct(false);
    await loadData();
  }

  async function deleteProduct(id: string) {
    const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setStatus("Unable to delete product");
      return;
    }

    setStatus("Product deleted");
    setIsCreatingProduct(false);
    await loadData();
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
    <div className="min-h-screen bg-[#0b1118] p-4 text-[#e6edf3] sm:p-6">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-slate-800 bg-[#101923] p-4">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <p className="mt-1 text-xs text-slate-400">Store control center</p>

          <ul className="mt-5 space-y-2">
            {([
              ["products", "Products List"],
              ["orders", "Orders List"],
              ["store", "Store Settings"],
              ["payments", "Payment Settings"],
            ] as Array<[MenuKey, string]>).map(([key, label]) => (
              <li key={key}>
                <button
                  onClick={() => setActiveMenu(key)}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                    activeMenu === key
                      ? "border-cyan-400 bg-cyan-500/20 text-cyan-200"
                      : "border-slate-700 bg-slate-900/40 text-slate-200 hover:border-slate-500"
                  }`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={logout}
            className="mt-6 w-full rounded-lg border border-rose-500/70 bg-rose-500/10 px-3 py-2 text-sm text-rose-200"
          >
            Logout
          </button>
        </aside>

        <main className="rounded-2xl border border-slate-800 bg-[#0f1722] p-4 sm:p-6">
          {activeMenu === "products" ? (
            <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
              <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Products</h2>
                  <button
                    onClick={startCreateProduct}
                    className="rounded-md bg-cyan-500 px-3 py-1 text-sm font-semibold text-black"
                  >
                    New Product
                  </button>
                </div>
                <div className="space-y-2">
                  {products.map((product) => (
                    <button
                      key={product._id}
                      onClick={() => selectProduct(product)}
                      className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                        selectedProductId === product._id && !isCreatingProduct
                          ? "border-cyan-400 bg-cyan-500/15"
                          : "border-slate-700 bg-slate-900/20 hover:border-slate-500"
                      }`}
                    >
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-slate-400">{product.dynasty} - ${product.priceUsd.toLocaleString("en-US")}</p>
                    </button>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4">
                <h2 className="text-lg font-semibold">{isCreatingProduct ? "Create Product" : "Edit Product"}</h2>
                <form onSubmit={saveProduct} className="mt-3 grid gap-2">
                  <input className="rounded-md bg-slate-800 px-3 py-2" placeholder="Name" value={productDraft.name} onChange={(e) => setProductDraft((prev) => ({ ...prev, name: e.target.value }))} />
                  <input className="rounded-md bg-slate-800 px-3 py-2" placeholder="Slug" value={productDraft.slug} onChange={(e) => setProductDraft((prev) => ({ ...prev, slug: e.target.value }))} />
                  <input className="rounded-md bg-slate-800 px-3 py-2" placeholder="Dynasty" value={productDraft.dynasty} onChange={(e) => setProductDraft((prev) => ({ ...prev, dynasty: e.target.value }))} />
                  <input className="rounded-md bg-slate-800 px-3 py-2" type="number" placeholder="Price USD" value={productDraft.priceUsd} onChange={(e) => setProductDraft((prev) => ({ ...prev, priceUsd: Number(e.target.value) }))} />
                  <input className="rounded-md bg-slate-800 px-3 py-2" placeholder="Image URL" value={productDraft.imageUrl} onChange={(e) => setProductDraft((prev) => ({ ...prev, imageUrl: e.target.value }))} />
                  <input className="rounded-md bg-slate-800 px-3 py-2" placeholder="Short Description" value={productDraft.shortDescription} onChange={(e) => setProductDraft((prev) => ({ ...prev, shortDescription: e.target.value }))} />
                  <textarea className="rounded-md bg-slate-800 px-3 py-2" placeholder="Long Description" value={productDraft.longDescription} onChange={(e) => setProductDraft((prev) => ({ ...prev, longDescription: e.target.value }))} />
                  <input className="rounded-md bg-slate-800 px-3 py-2" placeholder="Provenance Code" value={productDraft.provenanceCode} onChange={(e) => setProductDraft((prev) => ({ ...prev, provenanceCode: e.target.value }))} />

                  <div className="mt-2 flex flex-wrap gap-2">
                    <button className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-semibold text-black">
                      {isCreatingProduct ? "Create" : "Save"}
                    </button>
                    {!isCreatingProduct && selectedProductId ? (
                      <button
                        type="button"
                        onClick={() => deleteProduct(selectedProductId)}
                        className="rounded-md border border-rose-400 px-4 py-2 text-sm text-rose-300"
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                </form>
              </section>
            </div>
          ) : null}

          {activeMenu === "orders" ? (
            <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
              <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4">
                <h2 className="text-lg font-semibold">Orders List</h2>
                <div className="mt-3 space-y-2">
                  {orders.length === 0 ? <p className="text-sm text-slate-400">No orders yet.</p> : null}
                  {orders.map((order) => (
                    <button
                      key={order._id}
                      onClick={() => setSelectedOrderId(order._id)}
                      className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                        selectedOrderId === order._id
                          ? "border-emerald-400 bg-emerald-500/15"
                          : "border-slate-700 bg-slate-900/20 hover:border-slate-500"
                      }`}
                    >
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-xs text-slate-400">${order.totalUsd.toLocaleString("en-US")} - {order.paymentMethod}</p>
                    </button>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4">
                <h2 className="text-lg font-semibold">Order Detail</h2>
                {selectedOrder ? (
                  <div className="mt-3 space-y-2 text-sm">
                    <p><span className="text-slate-400">Customer:</span> {selectedOrder.customerName}</p>
                    <p><span className="text-slate-400">Email:</span> {selectedOrder.customerEmail}</p>
                    <p><span className="text-slate-400">Amount:</span> ${selectedOrder.totalUsd.toLocaleString("en-US")}</p>
                    <p><span className="text-slate-400">Payment:</span> {selectedOrder.paymentMethod}</p>
                    <p><span className="text-slate-400">Status:</span> {selectedOrder.orderStatus} / {selectedOrder.paymentStatus}</p>
                    <p><span className="text-slate-400">Created:</span> {new Date(selectedOrder.createdAt).toLocaleString("en-US")}</p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-400">Select an order to view details.</p>
                )}
              </section>
            </div>
          ) : null}

          {activeMenu === "store" ? (
            <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4">
              <h2 className="text-lg font-semibold">Store Settings</h2>
              <form onSubmit={saveSettings} className="mt-3 grid gap-3 md:grid-cols-2">
                <input className="rounded-md bg-slate-800 px-3 py-2" placeholder="Store Name" value={settings.storeName} onChange={(e) => setSettings((prev) => ({ ...prev, storeName: e.target.value }))} />
                <input className="rounded-md bg-slate-800 px-3 py-2" placeholder="Treasury Title" value={settings.treasuryTitle} onChange={(e) => setSettings((prev) => ({ ...prev, treasuryTitle: e.target.value }))} />
                <textarea className="rounded-md bg-slate-800 px-3 py-2 md:col-span-2" placeholder="Hero Title" value={settings.heroTitle} onChange={(e) => setSettings((prev) => ({ ...prev, heroTitle: e.target.value }))} />
                <textarea className="rounded-md bg-slate-800 px-3 py-2 md:col-span-2" placeholder="Hero Subtitle" value={settings.heroSubtitle} onChange={(e) => setSettings((prev) => ({ ...prev, heroSubtitle: e.target.value }))} />
                <input className="rounded-md bg-slate-800 px-3 py-2" placeholder="Contact Email" value={settings.contactEmail} onChange={(e) => setSettings((prev) => ({ ...prev, contactEmail: e.target.value }))} />
                <input className="rounded-md bg-slate-800 px-3 py-2" placeholder="Contact Phone" value={settings.contactPhone} onChange={(e) => setSettings((prev) => ({ ...prev, contactPhone: e.target.value }))} />
                <input className="rounded-md bg-slate-800 px-3 py-2 md:col-span-2" placeholder="Contact Address" value={settings.contactAddress} onChange={(e) => setSettings((prev) => ({ ...prev, contactAddress: e.target.value }))} />
                <input className="rounded-md bg-slate-800 px-3 py-2" placeholder="Menu Items (comma separated)" value={settings.menuItems.join(", ")} onChange={(e) => setSettings((prev) => ({ ...prev, menuItems: e.target.value.split(",").map((item) => item.trim()) }))} />
                <input className="rounded-md bg-slate-800 px-3 py-2" placeholder="Payment Labels (comma separated)" value={settings.paymentLabels.join(", ")} onChange={(e) => setSettings((prev) => ({ ...prev, paymentLabels: e.target.value.split(",").map((item) => item.trim()) }))} />
                <button className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-semibold text-black md:col-span-2">Save Store Settings</button>
              </form>
            </section>
          ) : null}

          {activeMenu === "payments" ? (
            <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4">
              <h2 className="text-lg font-semibold">Payment Gateway Settings</h2>
              <form onSubmit={saveSettings} className="mt-3 grid gap-3 md:grid-cols-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={settings.allowStripe} onChange={(e) => setSettings((prev) => ({ ...prev, allowStripe: e.target.checked }))} /> Enable Stripe
                </label>
                <input className="rounded-md bg-slate-800 px-3 py-2" placeholder="Stripe Publishable Key" value={settings.stripePublicKey} onChange={(e) => setSettings((prev) => ({ ...prev, stripePublicKey: e.target.value }))} />
                <input className="rounded-md bg-slate-800 px-3 py-2 md:col-span-2" placeholder="Stripe Webhook Endpoint" value={settings.stripeWebhookEndpoint} onChange={(e) => setSettings((prev) => ({ ...prev, stripeWebhookEndpoint: e.target.value }))} />

                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={settings.allowTwoCheckout} onChange={(e) => setSettings((prev) => ({ ...prev, allowTwoCheckout: e.target.checked }))} /> Enable 2Checkout
                </label>
                <input className="rounded-md bg-slate-800 px-3 py-2" placeholder="2Checkout Seller ID" value={settings.twoCheckoutSellerId} onChange={(e) => setSettings((prev) => ({ ...prev, twoCheckoutSellerId: e.target.value }))} />
                <input className="rounded-md bg-slate-800 px-3 py-2 md:col-span-2" placeholder="2Checkout Webhook Endpoint" value={settings.twoCheckoutWebhookEndpoint} onChange={(e) => setSettings((prev) => ({ ...prev, twoCheckoutWebhookEndpoint: e.target.value }))} />

                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={settings.allowQr} onChange={(e) => setSettings((prev) => ({ ...prev, allowQr: e.target.checked }))} /> Enable QR Payment
                </label>
                <input className="rounded-md bg-slate-800 px-3 py-2" placeholder="QR Provider Name" value={settings.qrProviderName} onChange={(e) => setSettings((prev) => ({ ...prev, qrProviderName: e.target.value }))} />
                <input className="rounded-md bg-slate-800 px-3 py-2" placeholder="QR Bank BIN" value={settings.qrBankBin} onChange={(e) => setSettings((prev) => ({ ...prev, qrBankBin: e.target.value }))} />
                <input className="rounded-md bg-slate-800 px-3 py-2" placeholder="QR Bank Account" value={settings.qrBankAccount} onChange={(e) => setSettings((prev) => ({ ...prev, qrBankAccount: e.target.value }))} />
                <input className="rounded-md bg-slate-800 px-3 py-2 md:col-span-2" placeholder="QR Account Name" value={settings.qrAccountName} onChange={(e) => setSettings((prev) => ({ ...prev, qrAccountName: e.target.value }))} />
                <input className="rounded-md bg-slate-800 px-3 py-2 md:col-span-2" placeholder="QR Callback Endpoint" value={settings.qrCallbackEndpoint} onChange={(e) => setSettings((prev) => ({ ...prev, qrCallbackEndpoint: e.target.value }))} />

                <button className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-black md:col-span-2">Save Payment Settings</button>
              </form>
            </section>
          ) : null}

          {status ? <p className="mt-4 text-sm text-amber-300">{status}</p> : null}
        </main>
      </div>
    </div>
  );
}
