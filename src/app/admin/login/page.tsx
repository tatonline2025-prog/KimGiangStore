"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Login failed.");
        return;
      }

      const params = new URLSearchParams(window.location.search);
      router.push(params.get("from") ?? "/admin");
      router.refresh();
    } catch {
      setError("Unable to login right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0d0b08] px-4 text-[#efe4cd]">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-4 border border-[#8d7750]/50 bg-black/35 p-6"
      >
        <h1 className="text-3xl">Admin Login</h1>
        <p className="text-sm text-[#d8c9ab]">
          Restricted access for store management and settings.
        </p>

        <input
          className="w-full border border-[#8d7750]/50 bg-black/20 px-3 py-2"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
        <input
          className="w-full border border-[#8d7750]/50 bg-black/20 px-3 py-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error ? <p className="text-sm text-red-300">{error}</p> : null}

        <button
          disabled={loading}
          className="w-full bg-[#cfb784] px-4 py-2 font-semibold text-black disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}
