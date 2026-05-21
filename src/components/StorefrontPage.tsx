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

type StoreSettings = {
  storeName: string;
  menuItems: string[];
  heroTitle: string;
  heroSubtitle: string;
  treasuryTitle: string;
  provenanceTitle: string;
  provenanceDescription: string;
  paymentLabels: string[];
  allowStripe: boolean;
  allowTwoCheckout: boolean;
  allowQr: boolean;
};

const heroArtifacts = [
  "/artifacts/buddha-gold.svg",
  "/artifacts/porcelain-jar.svg",
  "/artifacts/lacquer-box.svg",
];

export function StorefrontPage({
  products,
  settings,
}: {
  products: CatalogItem[];
  settings: StoreSettings;
}) {
  const [selected, setSelected] = useState<CatalogItem | null>(products[0] ?? null);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "twocheckout" | "qr">("stripe");
  const [customerName, setCustomerName] = useState("Kim Giang Collector");
  const [customerEmail, setCustomerEmail] = useState("collector@example.com");
  const [loading, setLoading] = useState(false);
  const [checkoutInfo, setCheckoutInfo] = useState<CheckoutResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const featured = useMemo(() => products.slice(0, 12), [products]);
  const enabledPayments = useMemo(() => {
    const methods: Array<{ value: "stripe" | "twocheckout" | "qr"; label: string }> = [];

    if (settings.allowStripe) {
      methods.push({ value: "stripe", label: "Stripe" });
    }
    if (settings.allowTwoCheckout) {
      methods.push({ value: "twocheckout", label: "2Checkout" });
    }
    if (settings.allowQr) {
      methods.push({ value: "qr", label: "QR Transfer" });
    }

    return methods;
  }, [settings.allowQr, settings.allowStripe, settings.allowTwoCheckout]);

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
    <div className="min-h-screen bg-[#e6e2d9] text-[#1e1b16]">
      <header className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-5 sm:flex-row sm:items-center sm:px-6">
        <div className="text-lg tracking-[0.18em] sm:text-xl">{settings.storeName}</div>
        <nav className="hidden gap-5 text-xs uppercase tracking-[0.2em] md:flex">
          {settings.menuItems.map((item) => (
            <a key={item} href="#" className="opacity-85 transition hover:opacity-100">
              {item}
            </a>
          ))}
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-12 pt-6 sm:px-6 md:grid-cols-[1.4fr_1fr]">
        <div className="relative overflow-hidden rounded-sm border border-[#8d7750]/35 bg-[radial-gradient(circle_at_15%_0%,#4e422e_0%,#2c2418_38%,#17120d_100%)] p-6 text-[#efe4cd] shadow-[0_20px_80px_-30px_rgba(0,0,0,0.8)] sm:p-8">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#cfb784]">Kim Giang Antiques</p>
          <h1 className="max-w-xl text-3xl leading-tight sm:text-4xl md:text-5xl">
            {settings.heroTitle}
          </h1>
          <p className="mt-4 max-w-xl text-sm text-[#d6c6a8]">{settings.heroSubtitle}</p>
          <button className="mt-6 border border-[#cfb784] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition hover:bg-[#cfb784] hover:text-black">
            Explore The Treasury
          </button>

          <div className="mt-7 grid grid-cols-3 gap-3 md:absolute md:bottom-6 md:right-6 md:mt-0 md:w-[46%]">
            {heroArtifacts.map((src) => (
              <div key={src} className="overflow-hidden border border-[#8d7750]/40 bg-black/30">
                <img
                  src={src}
                  alt="Artifact"
                  className="h-28 w-full object-cover md:h-36"
                  onError={(event) => {
                    event.currentTarget.src = "/artifacts/artifact-fallback.svg";
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-sm border border-[#8d7750]/40 bg-[#111]/90 p-5 text-[#efe4cd]">
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
              {enabledPayments.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
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

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <h2 className="mb-4 text-center text-3xl sm:text-4xl">{settings.treasuryTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((item) => (
            <article
              key={item.slug}
              className={`cursor-pointer border bg-[#f8f7f4] p-2 transition ${
                selected?.slug === item.slug ? "border-[#b8965f]" : "border-[#cec7b8]"
              }`}
              onClick={() => setSelected(item)}
            >
              <div className="h-48 w-full overflow-hidden bg-[#1d1a15]">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = "/artifacts/artifact-fallback.svg";
                  }}
                />
              </div>
              <div className="pt-3 text-[#161513]">
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-[#38312a]">({item.dynasty})</p>
                <p className="mt-1 text-lg text-[#171513]">${item.priceUsd.toLocaleString("en-US")}</p>
                <button className="mt-2 w-full border border-[#b7ac96] py-1 text-xs uppercase tracking-[0.15em]">
                  View Details
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-14 sm:px-6 md:grid-cols-[1.2fr_1fr]">
        <div className="border border-[#cec7b8] bg-[#f8f7f4] p-6">
          <h3 className="text-3xl">{settings.provenanceTitle}</h3>
          <p className="mt-3 text-sm text-[#443b32]">
            Every artifact includes ownership records, historical context, and verification references. Code for selected item:
            <span className="ml-2 font-semibold text-[#161513]">{selected?.provenanceCode}</span>
          </p>
          <p className="mt-2 text-sm text-[#443b32]">{settings.provenanceDescription}</p>
        </div>
        <div className="border border-[#cec7b8] bg-[#f8f7f4] p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[#7b6340]">Accepted Payments</p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            {settings.paymentLabels.map((label) => (
              <span key={label} className="border border-[#b7ac96] px-3 py-2">
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#17130f] py-8 text-[#d9c8a9]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 text-sm sm:px-6">
          <p>{settings.storeName}</p>
          <p>Secure payment and documented provenance for every listed artifact.</p>
        </div>
      </footer>
    </div>
  );
}
