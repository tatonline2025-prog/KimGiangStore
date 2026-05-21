import Link from "next/link";

import { defaultPages } from "@/lib/page-defaults";
import { connectDb } from "@/lib/db";
import { PageContent } from "@/models/PageContent";

async function getPage() {
  try {
    const dbReady = await connectDb();
    if (dbReady) {
      const doc = await PageContent.findOne({ key: "services" }).lean() as Record<string, string> | null;
      if (doc) return doc;
    }
  } catch {}
  return { key: "services", ...defaultPages.services };
}

export default async function ServicesPage() {
  const page = await getPage();
  let services: Array<{ icon: string; heading: string; description: string }> = [];
  try {
    services = JSON.parse(page.body ?? "[]");
  } catch {}

  const accentColors = ["#c47b2a", "#4dc98e", "#6ba8d4", "#c4844a", "#c4604a", "#9b8ac4"];

  return (
    <div className="min-h-screen bg-[#0e0c09] text-[#ede5d5]">
      <header className="sticky top-0 z-30 border-b border-[#3a3020]/60 bg-[#0e0c09]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-lg font-semibold tracking-[0.15em] text-[#cfb784]">
            KIM GIANG ANTIQUES
          </Link>
          <nav className="hidden gap-6 text-xs uppercase tracking-[0.2em] md:flex">
            {["Collections", "Services", "Provenance", "About", "Contact"].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} className="opacity-70 transition hover:opacity-100 hover:text-[#cfb784]">
                {item}
              </Link>
            ))}
          </nav>
          <Link href="/" className="text-xs uppercase tracking-[0.2em] text-[#cfb784]/70 hover:text-[#cfb784]">
            ← Back
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#cfb784]">Kim Giang Antiques</p>
          <h1 className="text-4xl font-light md:text-5xl">{page.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#b5a98a]">{page.subtitle}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((svc, i) => (
            <div
              key={i}
              className="rounded-xl border border-[#3a3020]/60 bg-[#16120d] p-6 transition hover:border-[#cfb784]/40"
              style={{ borderTopColor: accentColors[i % accentColors.length], borderTopWidth: 2 }}
            >
              <span className="text-3xl">{svc.icon}</span>
              <h3 className="mt-3 text-lg font-semibold">{svc.heading}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#b5a98a]">{svc.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-[#3a3020]/60 bg-[#16120d] p-8 text-center">
          <h2 className="text-2xl font-light">Ready to consult?</h2>
          <p className="mt-3 text-sm text-[#b5a98a]">Our specialists are available by appointment for private viewings, collection assessments, and authentication inquiries.</p>
          <Link href="/contact" className="mt-6 inline-block border border-[#cfb784] px-8 py-3 text-xs uppercase tracking-[0.2em] text-[#cfb784] transition hover:bg-[#cfb784] hover:text-black">
            Contact Us
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#3a3020]/50 bg-[#0a0804] py-8 text-center text-xs text-[#7a6a52]">
        <p>© {new Date().getFullYear()} Kim Giang Antiques. All rights reserved.</p>
      </footer>
    </div>
  );
}
