import Link from "next/link";
import Image from "next/image";

import { defaultPages } from "@/lib/page-defaults";
import { connectDb } from "@/lib/db";
import { PageContent } from "@/models/PageContent";

async function getPage() {
  try {
    const dbReady = await connectDb();
    if (dbReady) {
      const doc = await PageContent.findOne({ key: "collections" }).lean() as Record<string, string> | null;
      if (doc) return doc;
    }
  } catch {}
  return { key: "collections", ...defaultPages.collections };
}

export default async function CollectionsPage() {
  const page = await getPage();
  let sections: Array<{ heading: string; description: string; image: string; accent: string }> = [];
  try {
    sections = JSON.parse(page.body ?? "[]");
  } catch {}

  return (
    <div className="min-h-screen bg-[#0e0c09] text-[#ede5d5]">
      <header className="sticky top-0 z-30 border-b border-[#3a3020]/60 bg-[#0e0c09]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-lg font-semibold tracking-[0.15em] text-[#cfb784]">
            KIM GIANG ANTIQUES
          </Link>
          <nav className="hidden gap-6 text-xs uppercase tracking-[0.2em] md:flex">
            {["Collections", "Services", "Provenance", "About", "Contact"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="opacity-70 transition hover:opacity-100 hover:text-[#cfb784]"
              >
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
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#cfb784]">Kim Giang Antiques</p>
          <h1 className="text-4xl font-light md:text-5xl">{page.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#b5a98a]">{page.subtitle}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((cat, i) => (
            <Link key={i} href="/#treasury" className="group relative overflow-hidden rounded-lg">
              <div className="relative h-64">
                <Image
                  src={cat.image}
                  alt={cat.heading}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span
                  className="mb-2 inline-block h-0.5 w-8"
                  style={{ backgroundColor: cat.accent }}
                />
                <h3 className="text-lg font-semibold">{cat.heading}</h3>
                <p className="mt-1 text-xs leading-relaxed text-white/70">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#3a3020]/50 bg-[#0a0804] py-8 text-center text-xs text-[#7a6a52]">
        <p>© {new Date().getFullYear()} Kim Giang Antiques. All rights reserved.</p>
      </footer>
    </div>
  );
}
