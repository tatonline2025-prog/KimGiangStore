import { writeFileSync } from "fs";

const src = `\
"use client";

import Image from "next/image";
import Link from "next/link";
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

type StoreSettings = {
  storeName: string;
  menuItems: string[];
  heroTitle: string;
  heroSubtitle: string;
  treasuryTitle: string;
  provenanceTitle: string;
  provenanceDescription: string;
  paymentLabels: string[];
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
};

const HERO_IMGS = [
  "https://images.unsplash.com/photo-1558980394-d9cfe2f1f190?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1610882648335-ced8fc8fa6b5?auto=format&fit=crop&w=900&q=80",
];

const CATEGORIES = [
  { label: "Bronze & Metalwork", accent: "#c47b2a", image: "https://images.unsplash.com/photo-1515442261605-65987783cb6a?auto=format&fit=crop&w=600&q=80", href: "/collections" },
  { label: "Jade & Gemstone", accent: "#4dc98e", image: "https://images.unsplash.com/photo-1558980394-d9cfe2f1f190?auto=format&fit=crop&w=600&q=80", href: "/collections" },
  { label: "Ceramics & Porcelain", accent: "#6ba8d4", image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80", href: "/collections" },
  { label: "Lacquer & Woodwork", accent: "#c4844a", image: "https://images.unsplash.com/photo-1610882648335-ced8fc8fa6b5?auto=format&fit=crop&w=600&q=80", href: "/collections" },
];

const SERVICES = [
  { icon: "🔍", label: "Authentication" },
  { icon: "📜", label: "Provenance Research" },
  { icon: "💎", label: "Appraisal" },
  { icon: "✈️", label: "Secure Export" },
];

const FALLBACK = "https://images.unsplash.com/photo-1524499982521-1ffd58dd89ea?auto=format&fit=crop&w=900&q=80";

const MENU_HREFS: Record<string, string> = {
  Collections: "/collections",
  "The Treasury": "#treasury",
  Services: "/services",
  Provenance: "/provenance",
  About: "/about",
  Contact: "/contact",
};

export function StorefrontPage({ products, settings }: { products: CatalogItem[]; settings: StoreSettings }) {
  const [selected, setSelected] = useState<CatalogItem | null>(products[0] ?? null);
  const [heroIdx, setHeroIdx] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const featured = useMemo(() => products.slice(0, 12), [products]);

  return (
    <div className="min-h-screen bg-[#0e0c09] text-[#ede5d5]">
      {/* ── header ── */}
      <header className="sticky top-0 z-30 border-b border-[#2e2615]/70 bg-[#0e0c09]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-base font-semibold tracking-[0.15em] text-[#cfb784] sm:text-lg">
            {settings.storeName}
          </Link>
          <nav className="hidden gap-6 text-xs uppercase tracking-[0.2em] md:flex">
            {settings.menuItems.map((item) => (
              <Link key={item} href={MENU_HREFS[item] ?? "#"} className="opacity-70 transition hover:opacity-100 hover:text-[#cfb784]">{item}</Link>
            ))}
          </nav>
          <button className="rounded p-2 text-[#cfb784]/70 hover:text-[#cfb784] md:hidden" onClick={() => setMobileMenuOpen((o) => !o)}>
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="border-t border-[#2e2615]/50 bg-[#0e0c09] px-5 py-3 md:hidden">
            <div className="flex flex-col gap-2">
              {settings.menuItems.map((item) => (
                <Link key={item} href={MENU_HREFS[item] ?? "#"} className="py-1 text-sm uppercase tracking-[0.2em] text-[#cfb784]/80 hover:text-[#cfb784]" onClick={() => setMobileMenuOpen(false)}>
                  {item}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ── hero ── */}
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-6">
        <div className="relative overflow-hidden rounded-2xl border border-[#8d7750]/30 bg-[radial-gradient(ellipse_at_20%_0%,#4e3a1a_0%,#1e1508_50%,#0d0a06_100%)] p-6 shadow-2xl sm:p-8 md:min-h-[480px]">
          {/* decorative border top glow */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#cfb784]/50 to-transparent" />

          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#cfb784]">Est. Hoi An, Vietnam</p>
          <h1 className="max-w-lg text-3xl font-light leading-tight sm:text-4xl md:text-5xl">{settings.heroTitle}</h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#c4b07a]">{settings.heroSubtitle}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="#treasury" className="inline-block border border-[#cfb784] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#cfb784] transition hover:bg-[#cfb784] hover:text-black">
              Explore The Treasury
            </Link>
            <Link href="/collections" className="inline-block border border-[#8d7750]/60 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8d7750] transition hover:border-[#cfb784]/60 hover:text-[#cfb784]">
              View Collections
            </Link>
          </div>

          {/* hero images */}
          <div className="mt-8 grid grid-cols-3 gap-3 md:absolute md:bottom-6 md:right-6 md:mt-0 md:w-[44%]">
            {HERO_IMGS.map((src, i) => (
              <button key={src} onClick={() => setHeroIdx(i)} className={\`group relative overflow-hidden rounded-lg border transition \${heroIdx === i ? "border-[#cfb784]" : "border-[#8d7750]/30 hover:border-[#8d7750]/70"}\`}>
                <div className="relative h-24 sm:h-32 md:h-[120px]">
                  <Image src={src} alt="Artifact" fill unoptimized className="object-cover transition duration-500 group-hover:scale-105" />
                </div>
              </button>
            ))}
          </div>

          {/* enlarged selected hero image on md+ */}
          {/* bottom decorative line */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#cfb784]/20 to-transparent" />
        </div>
      </section>

      {/* ── category strip ── */}
      <section className="mx-auto max-w-7xl px-5 pb-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.label} href={cat.href} className="group relative overflow-hidden rounded-xl">
              <div className="relative h-40 sm:h-52">
                <Image src={cat.image} alt={cat.label} fill unoptimized className="object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <span className="mb-1 block h-0.5 w-6 transition-all group-hover:w-10" style={{ backgroundColor: cat.accent }} />
                  <p className="text-sm font-semibold leading-tight">{cat.label}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── treasury ── */}
      <section id="treasury" className="mx-auto max-w-7xl px-5 pb-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-3xl font-light sm:text-4xl">{settings.treasuryTitle}</h2>
          <Link href="/collections" className="hidden text-xs uppercase tracking-[0.2em] text-[#cfb784]/70 hover:text-[#cfb784] sm:block">
            All Collections →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featured.map((item) => (
            <article
              key={item.slug}
              className={\`group cursor-pointer overflow-hidden rounded-xl border bg-[#16120d] transition hover:shadow-2xl \${selected?.slug === item.slug ? "border-[#cfb784]" : "border-[#2e2615] hover:border-[#8d7750]/60"}\`}
              onClick={() => setSelected(item)}
            >
              <div className="relative h-52 overflow-hidden bg-[#0a0804]">
                <Image
                  src={item.imageUrl || FALLBACK}
                  alt={item.name}
                  fill
                  unoptimized
                  className="object-cover transition duration-500 group-hover:scale-105"
                  onError={(e) => { e.currentTarget.src = FALLBACK; }}
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#16120d] to-transparent" />
              </div>
              <div className="p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8d7750]">{item.dynasty}</p>
                <p className="mt-1 font-semibold leading-snug">{item.name}</p>
                <p className="mt-1 text-xs text-[#8d7750]/80 line-clamp-2">{item.shortDescription}</p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-lg font-semibold text-[#cfb784]">\${item.priceUsd.toLocaleString("en-US")}</p>
                  <span className="rounded-full border border-[#8d7750]/40 px-3 py-1 text-xs text-[#8d7750] transition group-hover:border-[#cfb784]/60 group-hover:text-[#cfb784]">View</span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6 text-center sm:hidden">
          <Link href="/collections" className="text-xs uppercase tracking-[0.2em] text-[#cfb784]/70 hover:text-[#cfb784]">All Collections →</Link>
        </div>
      </section>

      {/* ── selected detail + provenance ── */}
      {selected && (
        <section className="mx-auto max-w-7xl px-5 pb-14">
          <div className="overflow-hidden rounded-2xl border border-[#2e2615] bg-[#16120d] md:flex">
            <div className="relative h-64 shrink-0 md:h-auto md:w-72">
              <Image src={selected.imageUrl || FALLBACK} alt={selected.name} fill unoptimized className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#cfb784]">{selected.dynasty}</p>
                <h3 className="mt-2 text-2xl font-light">{selected.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#b5a98a]">{selected.shortDescription}</p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-[#2e2615] pt-4">
                <div>
                  <p className="text-xs text-[#8d7750]">Provenance Code</p>
                  <p className="font-mono text-sm font-semibold text-[#cfb784]">{selected.provenanceCode}</p>
                </div>
                <p className="text-2xl font-semibold text-[#cfb784]">\${selected.priceUsd.toLocaleString("en-US")}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── about strip ── */}
      <section className="border-y border-[#2e2615]/60 bg-[#16120d] py-16">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid items-center gap-10 md:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#cfb784]">Est. Hoi An, Vietnam</p>
              <h2 className="text-3xl font-light leading-tight sm:text-4xl">Three Generations of Expertise</h2>
              <p className="mt-4 text-sm leading-relaxed text-[#b5a98a]">
                Kim Giang Antiques was founded on the principle that great art should be understood, not merely possessed.
                Every object in our collection carries documented history, verified ownership, and independent authentication.
              </p>
              <Link href="/about" className="mt-6 inline-block border border-[#cfb784]/60 px-6 py-3 text-xs uppercase tracking-[0.2em] text-[#cfb784]/80 transition hover:border-[#cfb784] hover:text-[#cfb784]">
                Our Story
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { v: "500+", l: "Authenticated Artifacts" },
                { v: "30+", l: "Years of Experience" },
                { v: "40+", l: "Countries Served" },
                { v: "100%", l: "Documented Provenance" },
              ].map((stat) => (
                <div key={stat.l} className="rounded-xl border border-[#2e2615] bg-[#1a1408] p-5 text-center">
                  <p className="text-2xl font-semibold text-[#cfb784]">{stat.v}</p>
                  <p className="mt-1 text-xs text-[#8d7750]">{stat.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── services strip ── */}
      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs uppercase tracking-[0.35em] text-[#cfb784]">Expert Services</p>
          <h2 className="text-3xl font-light sm:text-4xl">What We Offer</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((svc) => (
            <Link key={svc.label} href="/services" className="group rounded-xl border border-[#2e2615] bg-[#16120d] p-5 text-center transition hover:border-[#cfb784]/40">
              <span className="text-3xl">{svc.icon}</span>
              <p className="mt-3 text-sm font-semibold">{svc.label}</p>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/services" className="text-xs uppercase tracking-[0.2em] text-[#cfb784]/70 hover:text-[#cfb784]">View All Services →</Link>
        </div>
      </section>

      {/* ── provenance + payments ── */}
      <section className="mx-auto max-w-7xl grid gap-5 px-5 pb-14 md:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl border border-[#2e2615] bg-[#16120d] p-6 md:p-8">
          <p className="mb-1 text-xs uppercase tracking-[0.3em] text-[#cfb784]">Documentation</p>
          <h3 className="text-2xl font-light">{settings.provenanceTitle}</h3>
          <p className="mt-3 text-sm leading-relaxed text-[#b5a98a]">{settings.provenanceDescription}</p>
          {selected && (
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-[#2e2615] bg-[#1a1408] px-4 py-3">
              <span className="text-[#cfb784]">📜</span>
              <div>
                <p className="text-xs text-[#8d7750]">Selected Artifact Code</p>
                <p className="font-mono text-sm font-semibold text-[#cfb784]">{selected.provenanceCode}</p>
              </div>
            </div>
          )}
          <Link href="/provenance" className="mt-4 inline-block text-xs uppercase tracking-[0.2em] text-[#cfb784]/70 hover:text-[#cfb784]">
            Learn More →
          </Link>
        </div>
        <div className="rounded-2xl border border-[#2e2615] bg-[#16120d] p-6 md:p-8">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[#cfb784]">Accepted Payments</p>
          <div className="flex flex-wrap gap-2">
            {settings.paymentLabels.map((label) => (
              <span key={label} className="rounded-lg border border-[#2e2615] bg-[#1a1408] px-3 py-2 text-xs font-medium text-[#b5a98a]">
                {label}
              </span>
            ))}
          </div>
          <div className="mt-6">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[#cfb784]">Contact</p>
            <div className="space-y-2 text-sm">
              {settings.contactAddress && <p className="text-[#8d7750]">📍 {settings.contactAddress}</p>}
              {settings.contactPhone && <a href={"tel:" + settings.contactPhone} className="block text-[#8d7750] hover:text-[#cfb784]">📞 {settings.contactPhone}</a>}
              {settings.contactEmail && <a href={"mailto:" + settings.contactEmail} className="block text-[#8d7750] hover:text-[#cfb784]">✉️ {settings.contactEmail}</a>}
            </div>
          </div>
        </div>
      </section>

      {/* ── footer ── */}
      <footer className="border-t border-[#2e2615]/60 bg-[#0a0804] py-10">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-8 sm:grid-cols-[1fr_auto_auto]">
            <div>
              <p className="mb-2 text-base font-semibold tracking-[0.15em] text-[#cfb784]">{settings.storeName}</p>
              <p className="max-w-xs text-sm text-[#5a5040]">Secure payment and documented provenance for every listed artifact.</p>
              {(settings.instagramUrl || settings.facebookUrl || settings.tiktokUrl) && (
                <div className="mt-4 flex gap-3">
                  {settings.instagramUrl && <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#5a5040] hover:text-[#cfb784]">Instagram</a>}
                  {settings.facebookUrl && <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#5a5040] hover:text-[#cfb784]">Facebook</a>}
                  {settings.tiktokUrl && <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#5a5040] hover:text-[#cfb784]">TikTok</a>}
                </div>
              )}
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#5a5040]">Discover</p>
              <div className="space-y-2">
                {["Collections", "Services", "Provenance", "About"].map((item) => (
                  <Link key={item} href={"/" + item.toLowerCase()} className="block text-sm text-[#5a5040] hover:text-[#cfb784]">{item}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#5a5040]">Contact</p>
              <div className="space-y-2 text-sm text-[#5a5040]">
                {settings.contactEmail && <a href={"mailto:" + settings.contactEmail} className="block hover:text-[#cfb784]">{settings.contactEmail}</a>}
                {settings.contactPhone && <a href={"tel:" + settings.contactPhone} className="block hover:text-[#cfb784]">{settings.contactPhone}</a>}
                <Link href="/contact" className="block hover:text-[#cfb784]">Send a Message →</Link>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-[#2e2615]/40 pt-6 text-xs text-[#3a3020]">
            © {new Date().getFullYear()} Kim Giang Antiques. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
`;

writeFileSync("src/components/StorefrontPage.tsx", src, "utf8");
console.log("StorefrontPage.tsx written, lines:", src.split("\n").length);
