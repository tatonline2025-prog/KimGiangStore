import { writeFileSync } from "fs";

const src = `\
"use client";

import Image from "next/image";
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

type PageDef = {
  key: string;
  title: string;
  subtitle: string;
  body: string;
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

type MenuKey = "dashboard" | "products" | "orders" | "pages" | "store" | "payments";

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

function NavItem({ active, icon, label, onClick }: { active: boolean; icon: string; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={\`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all \${active ? "bg-amber-50 text-amber-700 shadow-sm ring-1 ring-amber-200" : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"}\`}>
      <span className="text-base">{icon}</span>{label}
    </button>
  );
}

function Badge({ text }: { text: string }) {
  const colors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700", confirmed: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700", delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700", paid: "bg-green-100 text-green-700",
    unpaid: "bg-gray-100 text-gray-600", stripe: "bg-indigo-100 text-indigo-700",
    qr: "bg-teal-100 text-teal-700", twocheckout: "bg-orange-100 text-orange-700",
  };
  const cls = colors[text?.toLowerCase().replace(/\\s+/g, "")] ?? "bg-gray-100 text-gray-600";
  return <span className={\`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium \${cls}\`}>{text}</span>;
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800">{value}</p>
        </div>
        <div className={\`flex h-11 w-11 items-center justify-center rounded-xl text-xl \${color}\`}>{icon}</div>
      </div>
    </div>
  );
}

function Field({ label, children, span2 = false }: { label: string; children: React.ReactNode; span2?: boolean }) {
  return (
    <div className={span2 ? "col-span-2" : ""}>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</label>
      {children}
    </div>
  );
}

const INPUT = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 shadow-sm transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100";
const TEXTAREA = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 shadow-sm transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 resize-y";
const TOGGLE_TRACK = "peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-amber-500 peer-checked:after:translate-x-full";

export function AdminPanel({
  initialProducts, initialOrders, initialSettings, initialPages,
}: {
  initialProducts: Product[]; initialOrders: Order[]; initialSettings: StoreSettings; initialPages: PageDef[];
}) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);
  const [pages, setPages] = useState<PageDef[]>(initialPages);
  const [activeMenu, setActiveMenu] = useState<MenuKey>("dashboard");
  const [selectedProductId, setSelectedProductId] = useState(initialProducts[0]?._id ?? "");
  const [selectedOrderId, setSelectedOrderId] = useState(initialOrders[0]?._id ?? "");
  const [selectedPageKey, setSelectedPageKey] = useState(initialPages[0]?.key ?? "");
  const [productDraft, setProductDraft] = useState<Product>(initialProducts[0] ?? blankProduct);
  const [pageDraft, setPageDraft] = useState<PageDef>(initialPages[0] ?? { key: "", title: "", subtitle: "", body: "" });
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [status, setStatus] = useState<{ text: string; type: "ok" | "err" } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selectedOrder = useMemo(() => orders.find((o) => o._id === selectedOrderId), [orders, selectedOrderId]);
  const totalRevenue = useMemo(() => orders.reduce((acc, o) => acc + o.totalUsd, 0), [orders]);
  const pendingOrders = useMemo(() => orders.filter((o) => o.orderStatus === "pending").length, [orders]);

  async function loadData() {
    const [pr, or, sr, pgr] = await Promise.all([
      fetch("/api/products", { cache: "no-store" }),
      fetch("/api/admin/orders", { cache: "no-store" }),
      fetch("/api/admin/settings", { cache: "no-store" }),
      fetch("/api/admin/pages", { cache: "no-store" }),
    ]);
    const pd = await pr.json(); const od = await or.json();
    const sd = await sr.json(); const pgd = await pgr.json();
    const np: Product[] = pd.products ?? []; const no: Order[] = od.orders ?? [];
    setProducts(np); setOrders(no);
    setSettings(sd.settings ?? initialSettings); setPages(pgd.pages ?? []);
    if (np.length > 0 && !np.find((p) => p._id === selectedProductId)) { setSelectedProductId(np[0]._id); setProductDraft(np[0]); }
    if (no.length > 0 && !no.find((o) => o._id === selectedOrderId)) setSelectedOrderId(no[0]._id);
  }

  function startCreateProduct() { setIsCreatingProduct(true); setSelectedProductId(""); setProductDraft(blankProduct); setStatus(null); }
  function selectProduct(p: Product) { setIsCreatingProduct(false); setSelectedProductId(p._id); setProductDraft(p); setStatus(null); }
  function selectPage(pg: PageDef) { setSelectedPageKey(pg.key); setPageDraft(pg); setStatus(null); }

  async function saveProduct(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const isNew = isCreatingProduct || !selectedProductId;
    const res = await fetch(isNew ? "/api/products" : \`/api/products/\${selectedProductId}\`, {
      method: isNew ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(productDraft),
    });
    const data = await res.json();
    if (!res.ok) { setStatus({ text: data.error ?? "Unable to save", type: "err" }); return; }
    setStatus({ text: isNew ? "Product created!" : "Product saved!", type: "ok" });
    setIsCreatingProduct(false); await loadData();
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(\`/api/products/\${id}\`, { method: "DELETE" });
    if (!res.ok) { setStatus({ text: "Unable to delete", type: "err" }); return; }
    setStatus({ text: "Product deleted", type: "ok" }); setIsCreatingProduct(false); await loadData();
  }

  async function saveSettings(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload = { ...settings, menuItems: settings.menuItems.filter((m) => m.trim()), paymentLabels: settings.paymentLabels.filter((m) => m.trim()) };
    const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (!res.ok) { setStatus({ text: data.error ?? "Unable to save", type: "err" }); return; }
    setSettings(data.settings); setStatus({ text: "Settings saved!", type: "ok" });
  }

  async function savePage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await fetch("/api/admin/pages", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(pageDraft) });
    const data = await res.json();
    if (!res.ok) { setStatus({ text: data.error ?? "Unable to save page", type: "err" }); return; }
    setStatus({ text: "Page saved!", type: "ok" }); await loadData();
  }

  async function logout() { await fetch("/api/admin/auth/logout", { method: "POST" }); router.push("/admin/login"); router.refresh(); }

  const navItems: Array<[MenuKey, string, string]> = [
    ["dashboard", "📊", "Dashboard"], ["products", "🏺", "Products"], ["orders", "📦", "Orders"],
    ["pages", "📄", "Pages"], ["store", "⚙️", "Store Settings"], ["payments", "💳", "Payment Gateways"],
  ];
  const pageKeyLabels: Record<string, string> = { collections: "Collections", services: "Services", provenance: "Provenance", about: "About", contact: "Contact" };

  const setP = (key: keyof Product) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setProductDraft((prev) => ({ ...prev, [key]: key === "priceUsd" ? Number(e.target.value) : e.target.value }));
  const setS = (key: keyof StoreSettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setSettings((prev) => ({ ...prev, [key]: e.target.value }));
  const setPg = (key: keyof PageDef) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setPageDraft((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {sidebarOpen && <div className="fixed inset-0 z-20 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={\`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-gray-100 bg-white shadow-lg transition-transform duration-300 lg:static lg:translate-x-0 \${sidebarOpen ? "translate-x-0" : "-translate-x-full"}\`}>
        <div className="flex h-16 items-center border-b border-gray-100 px-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-sm text-white">🏺</span>
            <div><p className="text-sm font-bold leading-none text-gray-800">Kim Giang</p><p className="text-xs text-gray-400">Admin Panel</p></div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-300">Main Menu</p>
          <div className="space-y-1">
            {navItems.map(([key, icon, label]) => (
              <NavItem key={key} active={activeMenu === key} icon={icon} label={label} onClick={() => { setActiveMenu(key); setSidebarOpen(false); setStatus(null); }} />
            ))}
          </div>
        </nav>
        <div className="border-t border-gray-100 px-3 py-4">
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50">
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden">☰</button>
            <h1 className="text-base font-semibold text-gray-800">{navItems.find(([k]) => k === activeMenu)?.[2]}</h1>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer" className="hidden rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-amber-300 hover:text-amber-600 sm:inline-flex">
            View Store ↗
          </a>
        </header>

        <main className="flex-1 overflow-y-auto p-5 lg:p-7">
          {status && (
            <div className={\`mb-5 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium \${status.type === "ok" ? "bg-green-50 text-green-700 ring-1 ring-green-200" : "bg-red-50 text-red-700 ring-1 ring-red-200"}\`}>
              {status.type === "ok" ? "✓" : "✕"} {status.text}
              <button onClick={() => setStatus(null)} className="ml-auto opacity-50 hover:opacity-100">✕</button>
            </div>
          )}

          {activeMenu === "dashboard" && (
            <div>
              <p className="mb-6 text-sm text-gray-400">Welcome back. Here is a quick overview of your store.</p>
              <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard label="Products" value={products.length} icon="🏺" color="bg-amber-50" />
                <StatCard label="Orders" value={orders.length} icon="📦" color="bg-blue-50" />
                <StatCard label="Revenue" value={"$" + totalRevenue.toLocaleString("en-US")} icon="💰" color="bg-green-50" />
                <StatCard label="Pending" value={pendingOrders} icon="⏳" color="bg-orange-50" />
              </div>
              <h2 className="mb-4 text-sm font-semibold text-gray-700">Recent Products</h2>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {products.slice(0, 4).map((p) => (
                  <div key={p._id} className="cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-md hover:ring-amber-200" onClick={() => { selectProduct(p); setActiveMenu("products"); }}>
                    <div className="relative h-36 bg-gray-100">
                      {p.imageUrl && <Image src={p.imageUrl} alt={p.name} fill unoptimized className="object-cover" />}
                    </div>
                    <div className="p-3">
                      <p className="truncate text-sm font-semibold text-gray-800">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.dynasty}</p>
                      <p className="mt-1 font-semibold text-amber-600">\${p.priceUsd.toLocaleString("en-US")}</p>
                    </div>
                  </div>
                ))}
              </div>
              {orders.length > 0 && (
                <>
                  <h2 className="mb-4 mt-8 text-sm font-semibold text-gray-700">Recent Orders</h2>
                  <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-400">
                        <tr><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-left">Amount</th><th className="px-4 py-3 text-left">Method</th><th className="px-4 py-3 text-left">Status</th></tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {orders.slice(0, 5).map((o) => (
                          <tr key={o._id} className="cursor-pointer hover:bg-amber-50/50" onClick={() => { setSelectedOrderId(o._id); setActiveMenu("orders"); }}>
                            <td className="px-4 py-3 font-medium text-gray-800">{o.customerName}</td>
                            <td className="px-4 py-3 text-gray-600">\${o.totalUsd.toLocaleString("en-US")}</td>
                            <td className="px-4 py-3"><Badge text={o.paymentMethod} /></td>
                            <td className="px-4 py-3"><Badge text={o.orderStatus} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {activeMenu === "products" && (
            <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800">Products ({products.length})</h2>
                  <button onClick={startCreateProduct} className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600">+ New</button>
                </div>
                <div className="space-y-2">
                  {products.map((p) => (
                    <button key={p._id} onClick={() => selectProduct(p)} className={\`flex w-full items-center gap-3 rounded-xl p-2 text-left transition \${selectedProductId === p._id && !isCreatingProduct ? "bg-amber-50 ring-1 ring-amber-200" : "hover:bg-gray-50"}\`}>
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {p.imageUrl && <Image src={p.imageUrl} alt={p.name} fill unoptimized className="object-cover" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-800">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.dynasty}</p>
                        <p className="text-xs font-semibold text-amber-600">\${p.priceUsd.toLocaleString("en-US")}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800">{isCreatingProduct ? "Create New Product" : "Edit Product"}</h2>
                  {productDraft.imageUrl && (
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl ring-1 ring-gray-200">
                      <Image src={productDraft.imageUrl} alt="preview" fill unoptimized className="object-cover" />
                    </div>
                  )}
                </div>
                <form onSubmit={saveProduct} className="grid grid-cols-2 gap-4">
                  <Field label="Product Name" span2><input className={INPUT} placeholder="e.g. Bronze Ceremonial Gong" value={productDraft.name} onChange={setP("name")} required /></Field>
                  <Field label="Slug"><input className={INPUT} placeholder="bronze-ceremonial-gong" value={productDraft.slug} onChange={setP("slug")} /></Field>
                  <Field label="Dynasty / Period"><input className={INPUT} placeholder="e.g. Dong Son" value={productDraft.dynasty} onChange={setP("dynasty")} /></Field>
                  <Field label="Price (USD)">
                    <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
                      <input className={INPUT + " pl-7"} type="number" min="0" step="100" value={productDraft.priceUsd} onChange={setP("priceUsd")} /></div>
                  </Field>
                  <Field label="Provenance Code"><input className={INPUT} placeholder="KG-COA-0001" value={productDraft.provenanceCode} onChange={setP("provenanceCode")} /></Field>
                  <Field label="Image URL" span2>
                    <input className={INPUT} placeholder="https://images.unsplash.com/photo-..." value={productDraft.imageUrl} onChange={setP("imageUrl")} />
                    {productDraft.imageUrl && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="relative h-20 w-28 overflow-hidden rounded-lg ring-1 ring-gray-200"><Image src={productDraft.imageUrl} alt="preview" fill unoptimized className="object-cover" /></div>
                        <p className="text-xs text-gray-400">Image preview</p>
                      </div>
                    )}
                  </Field>
                  <Field label="Short Description" span2><input className={INPUT} placeholder="One-line summary" value={productDraft.shortDescription} onChange={setP("shortDescription")} /></Field>
                  <Field label="Long Description" span2><textarea className={TEXTAREA} rows={4} placeholder="Detailed description..." value={productDraft.longDescription} onChange={setP("longDescription")} /></Field>
                  <div className="col-span-2 flex flex-wrap gap-3 pt-1">
                    <button type="submit" className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600">{isCreatingProduct ? "Create Product" : "Save Changes"}</button>
                    {!isCreatingProduct && selectedProductId && (
                      <button type="button" onClick={() => deleteProduct(selectedProductId)} className="rounded-lg border border-red-200 px-5 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50">Delete</button>
                    )}
                    {isCreatingProduct && (
                      <button type="button" onClick={() => { setIsCreatingProduct(false); setProductDraft(products[0] ?? blankProduct); setSelectedProductId(products[0]?._id ?? ""); }} className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm text-gray-500 hover:bg-gray-50">Cancel</button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeMenu === "orders" && (
            <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
              <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
                <div className="border-b border-gray-50 px-5 py-4"><h2 className="font-semibold text-gray-800">Orders ({orders.length})</h2></div>
                {orders.length === 0 ? <p className="px-5 py-10 text-center text-sm text-gray-400">No orders yet.</p> : (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-400">
                      <tr><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-left">Amount</th><th className="px-4 py-3 text-left">Method</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Date</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.map((o) => (
                        <tr key={o._id} className={\`cursor-pointer transition \${selectedOrderId === o._id ? "bg-amber-50" : "hover:bg-gray-50"}\`} onClick={() => setSelectedOrderId(o._id)}>
                          <td className="px-4 py-3"><p className="font-medium text-gray-800">{o.customerName}</p><p className="text-xs text-gray-400">{o.customerEmail}</p></td>
                          <td className="px-4 py-3 font-semibold text-gray-700">\${o.totalUsd.toLocaleString("en-US")}</td>
                          <td className="px-4 py-3"><Badge text={o.paymentMethod} /></td>
                          <td className="px-4 py-3"><Badge text={o.orderStatus} /></td>
                          <td className="px-4 py-3 text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString("en-GB")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                <h2 className="mb-4 font-semibold text-gray-800">Order Detail</h2>
                {selectedOrder ? (
                  <div className="space-y-3 text-sm">
                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-xs font-semibold uppercase text-gray-400">Customer</p>
                      <p className="mt-1 font-medium">{selectedOrder.customerName}</p>
                      <p className="text-gray-500">{selectedOrder.customerEmail}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-gray-50 p-3"><p className="text-xs font-semibold uppercase text-gray-400">Amount</p><p className="mt-1 text-lg font-bold text-amber-600">\${selectedOrder.totalUsd.toLocaleString("en-US")}</p></div>
                      <div className="rounded-xl bg-gray-50 p-3"><p className="text-xs font-semibold uppercase text-gray-400">Payment</p><div className="mt-1"><Badge text={selectedOrder.paymentMethod} /></div></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-gray-50 p-3"><p className="text-xs font-semibold uppercase text-gray-400">Order</p><div className="mt-1"><Badge text={selectedOrder.orderStatus} /></div></div>
                      <div className="rounded-xl bg-gray-50 p-3"><p className="text-xs font-semibold uppercase text-gray-400">Payment</p><div className="mt-1"><Badge text={selectedOrder.paymentStatus} /></div></div>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-3"><p className="text-xs font-semibold uppercase text-gray-400">Created</p><p className="mt-1">{new Date(selectedOrder.createdAt).toLocaleString("en-GB")}</p></div>
                  </div>
                ) : <p className="text-sm text-gray-400">Select an order to view details.</p>}
              </div>
            </div>
          )}

          {activeMenu === "pages" && (
            <div className="grid gap-6 xl:grid-cols-[220px_1fr]">
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                <h2 className="mb-3 font-semibold text-gray-800">Site Pages</h2>
                <div className="space-y-1.5">
                  {pages.map((pg) => (
                    <button key={pg.key} onClick={() => selectPage(pg)} className={\`w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition \${selectedPageKey === pg.key ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200" : "text-gray-600 hover:bg-gray-50"}\`}>
                      {pageKeyLabels[pg.key] ?? pg.key}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800">Edit — {pageKeyLabels[pageDraft.key] ?? pageDraft.key}</h2>
                  <a href={"/" + pageDraft.key} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-600 hover:underline">View page ↗</a>
                </div>
                <form onSubmit={savePage} className="grid gap-4">
                  <Field label="Page Title" span2><input className={INPUT} value={pageDraft.title} onChange={setPg("title")} /></Field>
                  <Field label="Subtitle" span2><input className={INPUT} value={pageDraft.subtitle} onChange={setPg("subtitle")} /></Field>
                  <Field label="Body (JSON)" span2>
                    <textarea className={TEXTAREA} rows={12} value={pageDraft.body} onChange={setPg("body")} />
                    <p className="mt-1 text-xs text-gray-400">Edit JSON to update page sections.</p>
                  </Field>
                  <div><button type="submit" className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600">Save Page</button></div>
                </form>
              </div>
            </div>
          )}

          {activeMenu === "store" && (
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h2 className="mb-5 font-semibold text-gray-800">Store Settings</h2>
              <form onSubmit={saveSettings} className="grid grid-cols-2 gap-4">
                <Field label="Store Name"><input className={INPUT} value={settings.storeName} onChange={setS("storeName")} /></Field>
                <Field label="Treasury Title"><input className={INPUT} value={settings.treasuryTitle} onChange={setS("treasuryTitle")} /></Field>
                <Field label="Hero Title" span2><textarea className={TEXTAREA} rows={2} value={settings.heroTitle} onChange={setS("heroTitle")} /></Field>
                <Field label="Hero Subtitle" span2><textarea className={TEXTAREA} rows={2} value={settings.heroSubtitle} onChange={setS("heroSubtitle")} /></Field>
                <Field label="Provenance Title" span2><input className={INPUT} value={settings.provenanceTitle} onChange={setS("provenanceTitle")} /></Field>
                <Field label="Provenance Description" span2><textarea className={TEXTAREA} rows={2} value={settings.provenanceDescription} onChange={setS("provenanceDescription")} /></Field>
                <div className="col-span-2 my-1 border-t border-gray-100" />
                <p className="col-span-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Contact</p>
                <Field label="Email"><input className={INPUT} value={settings.contactEmail} onChange={setS("contactEmail")} /></Field>
                <Field label="Phone"><input className={INPUT} value={settings.contactPhone} onChange={setS("contactPhone")} /></Field>
                <Field label="Address" span2><input className={INPUT} value={settings.contactAddress} onChange={setS("contactAddress")} /></Field>
                <div className="col-span-2 my-1 border-t border-gray-100" />
                <p className="col-span-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Navigation and Payments</p>
                <Field label="Menu Items (comma separated)"><input className={INPUT} value={settings.menuItems.join(", ")} onChange={(e) => setSettings((p) => ({ ...p, menuItems: e.target.value.split(",").map((v) => v.trim()) }))} /></Field>
                <Field label="Payment Labels (comma separated)"><input className={INPUT} value={settings.paymentLabels.join(", ")} onChange={(e) => setSettings((p) => ({ ...p, paymentLabels: e.target.value.split(",").map((v) => v.trim()) }))} /></Field>
                <div className="col-span-2 my-1 border-t border-gray-100" />
                <p className="col-span-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Social Links</p>
                <Field label="Instagram"><input className={INPUT} value={settings.instagramUrl} onChange={setS("instagramUrl")} /></Field>
                <Field label="Facebook"><input className={INPUT} value={settings.facebookUrl} onChange={setS("facebookUrl")} /></Field>
                <Field label="TikTok"><input className={INPUT} value={settings.tiktokUrl} onChange={setS("tiktokUrl")} /></Field>
                <div className="col-span-2 pt-2">
                  <button type="submit" className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600">Save Store Settings</button>
                </div>
              </form>
            </div>
          )}

          {activeMenu === "payments" && (
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h2 className="mb-5 font-semibold text-gray-800">Payment Gateway Settings</h2>
              <form onSubmit={saveSettings} className="space-y-6">
                {[
                  { key: "allowStripe" as const, label: "Stripe", color: "text-indigo-700", fields: [
                    { f: "stripePublicKey" as const, label: "Publishable Key", ph: "pk_live_..." },
                    { f: "stripeWebhookEndpoint" as const, label: "Webhook Endpoint", ph: "https://.../api/webhooks/stripe" },
                  ]},
                  { key: "allowTwoCheckout" as const, label: "2Checkout", color: "text-orange-700", fields: [
                    { f: "twoCheckoutSellerId" as const, label: "Seller ID", ph: "12345678" },
                    { f: "twoCheckoutWebhookEndpoint" as const, label: "Webhook Endpoint", ph: "https://.../api/webhooks/twocheckout" },
                  ]},
                  { key: "allowQr" as const, label: "QR Bank Transfer", color: "text-teal-700", fields: [
                    { f: "qrProviderName" as const, label: "Provider Name", ph: "VietQR" },
                    { f: "qrBankBin" as const, label: "Bank BIN", ph: "970418" },
                    { f: "qrBankAccount" as const, label: "Account Number", ph: "1234567890" },
                    { f: "qrAccountName" as const, label: "Account Name", ph: "NGUYEN THI KIM" },
                    { f: "qrCallbackEndpoint" as const, label: "Callback Endpoint", ph: "https://.../api/webhooks/qr" },
                  ]},
                ].map((gw) => (
                  <div key={gw.key} className="rounded-xl border border-gray-100 p-5">
                    <div className="mb-4 flex items-center gap-3">
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" className="peer sr-only" checked={settings[gw.key]} onChange={(e) => setSettings((p) => ({ ...p, [gw.key]: e.target.checked }))} />
                        <div className={TOGGLE_TRACK} />
                      </label>
                      <span className={\`text-sm font-semibold \${gw.color}\`}>{gw.label}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {gw.fields.map((fd) => (
                        <Field key={fd.f} label={fd.label}>
                          <input className={INPUT} placeholder={fd.ph} value={settings[fd.f] as string} onChange={setS(fd.f)} />
                        </Field>
                      ))}
                    </div>
                  </div>
                ))}
                <button type="submit" className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600">Save Payment Settings</button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
`;

writeFileSync("src/components/AdminPanel.tsx", src, "utf8");
console.log("AdminPanel.tsx written, lines:", src.split("\n").length);
