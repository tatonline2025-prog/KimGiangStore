import Link from "next/link";

import { defaultPages } from "@/lib/page-defaults";
import { connectDb } from "@/lib/db";
import { PageContent } from "@/models/PageContent";

async function getPage() {
  try {
    const dbReady = await connectDb();
    if (dbReady) {
      const doc = await PageContent.findOne({ key: "about" }).lean() as Record<string, string> | null;
      if (doc) return doc;
    }
  } catch {}
  return { key: "about", ...defaultPages.about };
}

export default async function AboutPage() {
  const page = await getPage();
  let data: {
    story: string;
    values: Array<{ title: string; detail: string }>;
    team: Array<{ name: string; role: string; bio: string }>;
  } = { story: "", values: [], team: [] };
  try {
    data = JSON.parse(page.body ?? "{}");
  } catch {}

  const valueColors = ["#c47b2a", "#4dc98e", "#6ba8d4", "#9b8ac4"];

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

      <section className="mx-auto max-w-5xl px-5 py-16">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#cfb784]">Est. Hoi An, Vietnam</p>
          <h1 className="text-4xl font-light md:text-5xl">{page.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#b5a98a]">{page.subtitle}</p>
        </div>

        <div className="mb-12 grid gap-8 rounded-2xl border border-[#3a3020]/60 bg-[#16120d] p-8 md:grid-cols-[1fr_280px]">
          <div>
            <h2 className="mb-4 text-xl font-light text-[#cfb784]">Our Story</h2>
            {data.story?.split("\n\n").map((para, i) => (
              <p key={i} className="mb-4 text-sm leading-relaxed text-[#c4b89a]">{para}</p>
            ))}
          </div>
          <div className="rounded-xl border border-[#cfb784]/20 bg-[#1a1408] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[#cfb784]">Kim Giang (金江)</p>
            <p className="mt-2 text-sm italic text-[#b5a98a]">Golden River</p>
            <div className="my-4 h-px bg-[#3a3020]" />
            <p className="text-xs text-[#7a6a52]">A tribute to the Thu Bon river that first carried silk, porcelain, and bronze goods through our ancestral region.</p>
          </div>
        </div>

        <h2 className="mb-6 text-center text-2xl font-light">Our Values</h2>
        <div className="mb-12 grid gap-4 sm:grid-cols-2">
          {data.values?.map((val, i) => (
            <div key={i} className="rounded-xl border border-[#3a3020]/60 bg-[#16120d] p-5">
              <div className="mb-2 h-0.5 w-8" style={{ backgroundColor: valueColors[i % valueColors.length] }} />
              <h3 className="font-semibold">{val.title}</h3>
              <p className="mt-2 text-sm text-[#b5a98a]">{val.detail}</p>
            </div>
          ))}
        </div>

        <h2 className="mb-6 text-center text-2xl font-light">Our Team</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {data.team?.map((member, i) => (
            <div key={i} className="rounded-xl border border-[#3a3020]/60 bg-[#16120d] p-5 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#cfb784]/20 text-xl font-semibold text-[#cfb784]">
                {member.name.charAt(0)}
              </div>
              <p className="font-semibold">{member.name}</p>
              <p className="text-xs text-[#cfb784]">{member.role}</p>
              <p className="mt-2 text-xs leading-relaxed text-[#7a6a52]">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#3a3020]/50 bg-[#0a0804] py-8 text-center text-xs text-[#7a6a52]">
        <p>© {new Date().getFullYear()} Kim Giang Antiques. All rights reserved.</p>
      </footer>
    </div>
  );
}
