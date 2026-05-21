import { Suspense } from "react";
import Link from "next/link";

function SimulatedCheckoutView() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-50">
      <div className="max-w-lg rounded-lg border border-slate-700 bg-slate-900 p-6">
        <h1 className="text-3xl font-semibold">Simulated Payment Screen</h1>
        <p className="mt-3 text-sm text-slate-300">
          This appears when payment credentials are not configured. Add env keys to activate real provider redirects.
        </p>
        <Link href="/" className="mt-5 inline-block underline">
          Back to Treasury
        </Link>
      </div>
    </main>
  );
}

export default function SimulatedCheckoutPage() {
  return (
    <Suspense>
      <SimulatedCheckoutView />
    </Suspense>
  );
}
