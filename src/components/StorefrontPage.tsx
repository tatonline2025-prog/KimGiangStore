"use client";

import { useMemo, useState } from "react";

type CatalogItem = {
  _id?: string;
  slug: string;
  name: string;
  dynasty: string;
  priceUsd: number;
  imageUrl: string;
  shortDescription: string;
  provenanceCode: string;
};

type CheckoutResponse = {
  orderId: string;
  provider: "stripe" | "twocheckout" | "qr";
  checkoutUrl?: string;
  qrDataUrl?: string;
  transferContent?: string;
  mode: "mock" | "live";
};

const navItems = ["Collections", "The Treasury", "Services", "Provenance", "About", "Contact"];

export function StorefrontPage({ products }: { products: CatalogItem[] }) {
  const [selected, setSelected] = useState<CatalogItem | null>(products[0] ?? null);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "twocheckout" | "qr">("stripe");
  const [customerName, setCustomerName] = useState("Kim Giang Collector");
  const [customerEmail, setCustomerEmail] = useState("collector@example.com");
  const [loading, setLoading] = useState(false);
  const [checkoutInfo, setCheckoutInfo] = useState<CheckoutResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const featured = useMemo(() => products.slice(0, 4), [products]);

  async function handleCheckout() {
    if (!selected) return;

    setLoading(true);
    setError(null);
    setCheckoutInfo(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          paymentMethod,
          item: {
            productId: selected._id ?? selected.slug,
            name: selected.name,
            priceUsd: selected.priceUsd,
            quantity: 1,
          },
        }),
      });

      const data = (await response.json()) as CheckoutResponse & { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Checkout failed");
      }

      setCheckoutInfo(data);
      if (data.checkoutUrl) {
        window.open(data.checkoutUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#3d3423_0%,#17130d_40%,#0d0b08_100%)] text-[#efe4cd]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="text-xl tracking-[0.2em]">KIM GIANG ANTIQUES</div>
        <nav className="hidden gap-5 text-xs uppercase tracking-[0.2em] md:flex">
          {navItems.map((item) => (
            <a key={item} href="#" className="opacity-85 transition hover:opacity-100">
              {item}
            </a>
          ))}
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 pb-12 pt-6 md:grid-cols-[1.4fr_1fr]">
        <div className="rounded-sm border border-[#8d7750]/40 bg-black/30 p-8 shadow-[0_20px_80px_-30px_rgba(0,0,0,0.8)]">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#cfb784]">Kim Giang Antiques</p>
          <h1 className="max-w-xl text-4xl leading-tight md:text-5xl">
            Preserving the legacy of ancient art where history finds its home.
          </h1>
          <p className="mt-4 max-w-xl text-sm text-[#d6c6a8]">Explore our curated collection of rare artifacts, each a testament to a bygone era.</p>
          <button className="mt-6 border border-[#cfb784] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition hover:bg-[#cfb784] hover:text-black">
            Explore The Treasury
          </button>
        </div>

        <div className="rounded-sm border border-[#8d7750]/40 bg-[#111]/80 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-[#cfb784]">Quick Checkout</p>
          <h2 className="mt-2 text-2xl">Secure Payment Options</h2>
          <div className="mt-4 grid gap-2 text-sm">
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="border border-[#8d7750]/40 bg-black/20 px-3 py-2 outline-none"
              placeholder="Customer name"
            />
            <input
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="border border-[#8d7750]/40 bg-black/20 px-3 py-2 outline-none"
              placeholder="Customer email"
            />
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as "stripe" | "twocheckout" | "qr")}
              className="border border-[#8d7750]/40 bg-black/20 px-3 py-2 outline-none"
            >
              <option value="stripe">Stripe</option>
              <option value="twocheckout">2Checkout</option>
              <option value="qr">QR Transfer</option>
            </select>
            <button
              onClick={handleCheckout}
              disabled={loading || !selected}
              className="mt-2 bg-[#cfb784] px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
            >
              {loading ? "Processing..." : `Buy ${selected?.name ?? "artifact"}`}
            </button>
          </div>

          {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}

          {checkoutInfo ? (
            <div className="mt-4 border border-[#8d7750]/40 p-3 text-xs text-[#e8dbc1]">
              <p>Order: {checkoutInfo.orderId}</p>
              <p>Method: {checkoutInfo.provider.toUpperCase()}</p>
              <p>Mode: {checkoutInfo.mode.toUpperCase()}</p>
              {checkoutInfo.transferContent ? <p>Transfer: {checkoutInfo.transferContent}</p> : null}
              {checkoutInfo.qrDataUrl ? (
                <img src={checkoutInfo.qrDataUrl} alt="QR checkout" className="mt-3 h-44 w-44 border border-[#8d7750]/40 bg-white p-1" />
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <h2 className="mb-4 text-center text-4xl">THE TREASURY</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {featured.map((item) => (
            <article
              key={item.slug}
              className={`cursor-pointer border bg-[#111]/85 p-2 transition ${
                selected?.slug === item.slug ? "border-[#d6b77f]" : "border-[#8d7750]/40"
              }`}
              onClick={() => setSelected(item)}
            >
              <div className="h-48 w-full overflow-hidden bg-[#1d1a15]">
                <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div className="pt-3">
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-[#d8c9ab]">({item.dynasty})</p>
                <p className="mt-1 text-lg text-[#f2deb0]">${item.priceUsd.toLocaleString("en-US")}</p>
                <button className="mt-2 w-full border border-[#8d7750]/60 py-1 text-xs uppercase tracking-[0.15em]">
                  View Details
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-14 md:grid-cols-[1.2fr_1fr]">
        <div className="border border-[#8d7750]/40 bg-[#120f0b]/90 p-6">
          <h3 className="text-3xl">Provenance & Certificate of Authenticity</h3>
          <p className="mt-3 text-sm text-[#d6c6a8]">
            Every artifact includes ownership records, historical context, and verification references. Code for selected item:
            <span className="ml-2 font-semibold text-[#f2deb0]">{selected?.provenanceCode}</span>
          </p>
        </div>
        <div className="border border-[#8d7750]/40 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[#cfb784]">Accepted Payments</p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <span className="border border-[#8d7750]/50 px-3 py-2">VISA</span>
            <span className="border border-[#8d7750]/50 px-3 py-2">MASTERCARD</span>
            <span className="border border-[#8d7750]/50 px-3 py-2">2CHECKOUT</span>
            <span className="border border-[#8d7750]/50 px-3 py-2">STRIPE</span>
            <span className="border border-[#8d7750]/50 px-3 py-2">QR TRANSFER</span>
          </div>
          <a href="/admin" className="mt-6 inline-block text-sm underline underline-offset-4">
            Open Admin Panel
          </a>
        </div>
      </section>
    </div>
  );
}
