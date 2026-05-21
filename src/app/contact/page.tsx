import Link from "next/link";

import { ContactForm } from "@/components/ContactForm";
import { defaultPages } from "@/lib/page-defaults";
import { connectDb } from "@/lib/db";
import { PageContent } from "@/models/PageContent";

async function getPage() {
  try {
    const dbReady = await connectDb();
    if (dbReady) {
      const doc = await PageContent.findOne({ key: "contact" }).lean() as Record<string, string> | null;
      if (doc) return doc;
    }
  } catch {}
  return { key: "contact", ...defaultPages.contact };
}

export default async function ContactPage() {
  const page = await getPage();
  let data: {
    address: string;
    phone: string;
    email: string;
    hours: string;
    social: { instagram: string; facebook: string; tiktok: string };
  } = { address: "", phone: "", email: "", hours: "", social: { instagram: "", facebook: "", tiktok: "" } };
  try {
    data = JSON.parse(page.body ?? "{}");
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
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#cfb784]">Get In Touch</p>
          <h1 className="text-4xl font-light md:text-5xl">{page.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#b5a98a]">{page.subtitle}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-5">
            <div className="rounded-xl border border-[#3a3020]/60 bg-[#16120d] p-5">
              <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[#cfb784]">Gallery Address</p>
              <p className="text-sm text-[#c4b89a]">{data.address}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#3a3020]/60 bg-[#16120d] p-5">
                <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[#cfb784]">Phone</p>
                <a href={`tel:${data.phone}`} className="text-sm text-[#c4b89a] hover:text-[#cfb784]">{data.phone}</a>
              </div>
              <div className="rounded-xl border border-[#3a3020]/60 bg-[#16120d] p-5">
                <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[#cfb784]">Email</p>
                <a href={`mailto:${data.email}`} className="break-all text-xs text-[#c4b89a] hover:text-[#cfb784]">{data.email}</a>
              </div>
            </div>
            <div className="rounded-xl border border-[#3a3020]/60 bg-[#16120d] p-5">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[#cfb784]">Opening Hours</p>
              {data.hours?.split("\n").map((line, i) => (
                <p key={i} className="text-sm text-[#c4b89a]">{line}</p>
              ))}
            </div>
            {data.social && (
              <div className="flex gap-3">
                {data.social.instagram && (
                  <a href={data.social.instagram} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-lg border border-[#3a3020]/60 bg-[#16120d] py-3 text-center text-xs uppercase tracking-[0.15em] text-[#cfb784] hover:border-[#cfb784]/40">
                    Instagram
                  </a>
                )}
                {data.social.facebook && (
                  <a href={data.social.facebook} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-lg border border-[#3a3020]/60 bg-[#16120d] py-3 text-center text-xs uppercase tracking-[0.15em] text-[#cfb784] hover:border-[#cfb784]/40">
                    Facebook
                  </a>
                )}
                {data.social.tiktok && (
                  <a href={data.social.tiktok} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-lg border border-[#3a3020]/60 bg-[#16120d] py-3 text-center text-xs uppercase tracking-[0.15em] text-[#cfb784] hover:border-[#cfb784]/40">
                    TikTok
                  </a>
                )}
              </div>
            )}
          </div>

          <ContactForm />
        </div>
      </section>

      <footer className="border-t border-[#3a3020]/50 bg-[#0a0804] py-8 text-center text-xs text-[#7a6a52]">
        <p>© {new Date().getFullYear()} Kim Giang Antiques. All rights reserved.</p>
      </footer>
    </div>
  );
}
