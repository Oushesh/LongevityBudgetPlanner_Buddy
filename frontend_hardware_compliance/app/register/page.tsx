"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { apiFetch } from "@/lib/api";
import { setTokens } from "@/lib/auth-storage";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const reg = await apiFetch("/auth/register", {
        method: "POST",
        auth: false,
        body: JSON.stringify({ username, email, password }),
      });
      const regBody = await reg.json().catch(() => ({}));
      if (!reg.ok) {
        setError(
          typeof regBody === "object" && regBody !== null
            ? JSON.stringify(regBody)
            : "Registration failed.",
        );
        return;
      }
      const login = await apiFetch("/auth/login", {
        method: "POST",
        auth: false,
        body: JSON.stringify({ username, password }),
      });
      const loginBody = await login.json().catch(() => ({}));
      if (!login.ok) {
        setError("Registered but login failed. Try signing in manually.");
        return;
      }
      setTokens(loginBody.access, loginBody.refresh);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-8 px-4 py-16">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Start mapping standards and drafting compliance documentation.
        </p>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Username
          <input
            className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Email
          <input
            type="email"
            className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Password (min 8)
          <input
            type="password"
            className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-fuchsia-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-fuchsia-500 disabled:opacity-60"
        >
          {loading ? "Creating…" : "Register & continue"}
        </button>
      </form>
      <p className="text-sm text-zinc-400">
        Already have an account?{" "}
        <Link href="/login" className="text-fuchsia-400 underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
