import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#2b1616] text-rose-50">
      <div className="max-w-lg rounded-lg border border-rose-700 bg-rose-900/40 p-6">
        <h1 className="text-3xl font-semibold">Payment Cancelled</h1>
        <p className="mt-3 text-sm">You can return to the store and retry with Stripe, 2Checkout, or QR.</p>
        <Link href="/" className="mt-5 inline-block underline">
          Back to Treasury
        </Link>
      </div>
    </main>
  );
}
