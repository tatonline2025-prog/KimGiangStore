"use client";

export function ContactForm() {
  return (
    <form
      className="rounded-2xl border border-[#3a3020]/60 bg-[#16120d] p-6"
      onSubmit={(e) => e.preventDefault()}
    >
      <h2 className="mb-5 text-lg font-light">Send Us a Message</h2>
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-[0.15em] text-[#cfb784]">First Name</label>
            <input className="w-full rounded-lg border border-[#3a3020] bg-[#1a1408] px-3 py-2.5 text-sm text-[#ede5d5] focus:border-[#cfb784]/50 focus:outline-none" placeholder="Nguyen" />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-[0.15em] text-[#cfb784]">Last Name</label>
            <input className="w-full rounded-lg border border-[#3a3020] bg-[#1a1408] px-3 py-2.5 text-sm text-[#ede5d5] focus:border-[#cfb784]/50 focus:outline-none" placeholder="Van A" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-[0.15em] text-[#cfb784]">Email</label>
          <input type="email" className="w-full rounded-lg border border-[#3a3020] bg-[#1a1408] px-3 py-2.5 text-sm text-[#ede5d5] focus:border-[#cfb784]/50 focus:outline-none" placeholder="you@example.com" />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-[0.15em] text-[#cfb784]">Subject</label>
          <select className="w-full rounded-lg border border-[#3a3020] bg-[#1a1408] px-3 py-2.5 text-sm text-[#ede5d5] focus:border-[#cfb784]/50 focus:outline-none">
            <option>Acquisition Inquiry</option>
            <option>Authentication Request</option>
            <option>Appraisal Service</option>
            <option>Private Viewing</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-[0.15em] text-[#cfb784]">Message</label>
          <textarea rows={5} className="w-full rounded-lg border border-[#3a3020] bg-[#1a1408] px-3 py-2.5 text-sm text-[#ede5d5] focus:border-[#cfb784]/50 focus:outline-none" placeholder="Tell us about your inquiry…" />
        </div>
        <button
          type="submit"
          className="rounded-lg border border-[#cfb784] bg-transparent px-6 py-3 text-xs uppercase tracking-[0.2em] text-[#cfb784] transition hover:bg-[#cfb784] hover:text-black"
        >
          Send Message
        </button>
      </div>
    </form>
  );
}
