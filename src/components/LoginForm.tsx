"use client";

import { FormEvent, useState } from "react";
import { AUTH_CONFIG } from "@/lib/config";
import { loginWithCss, verifySession } from "@/lib/auth";

function isLocalDevHost() {
  if (typeof window === "undefined") return true;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1";
}

type Props = {
  onSuccess: () => void;
};

export function LoginForm({ onSuccess }: Props) {
  const localDev = isLocalDevHost();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState(localDev ? "admin123" : "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await loginWithCss(AUTH_CONFIG, username, password);
      const ok = await verifySession(AUTH_CONFIG);
      if (!ok) throw new Error("Login succeeded but session check failed");
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="relative z-10 flex min-h-dvh flex-col justify-center px-4 py-8">
      <form
        onSubmit={onSubmit}
        className="pd-rise mx-auto w-full max-w-[360px]"
        style={{ display: "grid", gap: "1rem" }}
      >
        <header>
          <h1
            className="m-0 text-[2.5rem] leading-none tracking-tight"
            style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
          >
            ProdDeck
          </h1>
          <p className="mt-3 text-[0.95rem] leading-snug text-[var(--pd-mist)]">
            Launch production apps after CSS sign-in.
          </p>
        </header>

        <label className="grid gap-1.5 text-sm text-[var(--pd-mist)]">
          Username
          <input
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="min-h-11 rounded-md border border-white/10 bg-[var(--pd-steel)] px-3 text-[var(--pd-paper)] outline-none focus:border-[var(--pd-lime)]"
          />
        </label>

        <label className="grid gap-1.5 text-sm text-[var(--pd-mist)]">
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="min-h-11 rounded-md border border-white/10 bg-[var(--pd-steel)] px-3 text-[var(--pd-paper)] outline-none focus:border-[var(--pd-lime)]"
          />
        </label>

        {error ? (
          <p className="m-0 text-sm text-[var(--pd-danger)]" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="min-h-11 rounded-md bg-[var(--pd-lime)] px-4 text-base font-semibold text-[var(--pd-ink)] disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <p className="m-0 text-xs text-[var(--pd-mist)]">
          clientId <code>proddeck</code>
          {localDev ? " — DEV: admin / admin123" : ""}
        </p>
      </form>
    </main>
  );
}
