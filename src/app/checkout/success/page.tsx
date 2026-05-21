import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-emerald-950 text-emerald-50">
      <div className="max-w-lg rounded-lg border border-emerald-700 bg-emerald-900/50 p-6">
        <h1 className="text-3xl font-semibold">Payment Successful</h1>
        <p className="mt-3 text-sm">Your order has been confirmed. Final status is synced by webhook.</p>
        <Link href="/" className="mt-5 inline-block underline">
          Back to Treasury
        </Link>
      </div>
    </main>
  );
}
