import Link from "next/link";

import { defaultPages } from "@/lib/page-defaults";
import { connectDb } from "@/lib/db";
import { PageContent } from "@/models/PageContent";

async function getPage() {
  try {
    const dbReady = await connectDb();
    if (dbReady) {
      const doc = await PageContent.findOne({ key: "provenance" }).lean() as Record<string, string> | null;
      if (doc) return doc;
    }
  } catch {}
  return { key: "provenance", ...defaultPages.provenance };
}

export default async function ProvenancePage() {
  const page = await getPage();
  let data: { intro: string; steps: Array<{ step: string; title: string; detail: string }>; closing: string } = {
    intro: "",
    steps: [],
    closing: "",
  };
  try {
    data = JSON.parse(page.body ?? "{}");
  } catch {}

  const stepColors = ["#c47b2a", "#4dc98e", "#6ba8d4", "#c4844a", "#9b8ac4"];

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

      <section className="mx-auto max-w-4xl px-5 py-16">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#cfb784]">Documentation & Trust</p>
          <h1 className="text-4xl font-light md:text-5xl">{page.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#b5a98a]">{page.subtitle}</p>
        </div>

        <div className="mb-12 rounded-xl border border-[#cfb784]/30 bg-[#1a1408] px-7 py-6 text-sm leading-relaxed text-[#d4c4a0] italic">
          {data.intro}
        </div>

        <div className="space-y-5">
          {data.steps?.map((step, i) => (
            <div key={i} className="flex gap-5 rounded-xl border border-[#3a3020]/60 bg-[#16120d] p-5">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-black"
                style={{ backgroundColor: stepColors[i % stepColors.length] }}
              >
                {step.step}
              </div>
              <div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-[#b5a98a]">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {data.closing && (
          <div className="mt-10 rounded-xl border border-[#3a3020]/60 bg-[#16120d] p-6 text-sm text-[#b5a98a]">
            <span className="mr-2 text-[#cfb784]">ℹ</span>
            {data.closing}
          </div>
        )}
      </section>

      <footer className="border-t border-[#3a3020]/50 bg-[#0a0804] py-8 text-center text-xs text-[#7a6a52]">
        <p>© {new Date().getFullYear()} Kim Giang Antiques. All rights reserved.</p>
      </footer>
    </div>
  );
}
