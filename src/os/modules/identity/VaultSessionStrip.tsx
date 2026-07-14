"use client";

import { useState } from "react";
import { AUTH_CONFIG } from "@/lib/config";
import { clearTokens } from "@/lib/auth";
import {
  openCssReAuth,
  useCssSessionFresh,
} from "./cssSessionFresh";

export type VaultSessionStripProps = {
  /** Called after local proddeck tokens are cleared. */
  onSignOut?: () => void;
  /** Re-auth redirect hook; default opens Vault (`/?osPlace=vault`). */
  onReAuth?: () => void;
};

function formatExpiry(exp?: number): string {
  if (!exp) return "unknown";
  return new Date(exp * 1000).toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function VaultSessionStrip({ onSignOut, onReAuth }: VaultSessionStripProps = {}) {
  const { ready, fresh: active, subject, expiry, refresh } = useCssSessionFresh();
  const [reAuthNote, setReAuthNote] = useState<string | null>(null);

  function handleSignOut() {
    clearTokens();
    setReAuthNote(null);
    onSignOut?.();
    refresh();
  }

  function handleReAuth() {
    if (onReAuth) {
      onReAuth();
      return;
    }
    setReAuthNote("Opening Vault for CSS re-auth…");
    openCssReAuth();
  }

  const clientId = AUTH_CONFIG.clientId;
  const username = subject ?? null;
  const expiryLabel = active && expiry ? formatExpiry(expiry) : null;

  if (!ready) {
    return (
      <section
        className="rounded-lg border border-white/10 bg-black/55 p-4 backdrop-blur-md"
        aria-label="Vault"
      >
        <p className="m-0 text-sm text-[var(--pd-mist)]">Loading session…</p>
      </section>
    );
  }

  return (
    <section
      className="rounded-lg border border-white/10 bg-black/55 p-4 backdrop-blur-md"
      aria-label="Vault"
    >
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <p
          className="m-0 text-sm text-[var(--pd-lime)]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
        >
          Vault
        </p>
        <span className="font-mono text-xs text-[var(--pd-mist)]">
          clientId <span className="text-[var(--pd-paper)]">{clientId}</span>
        </span>
      </header>

      <dl className="mt-3 grid gap-2 text-sm">
        <div className="flex min-h-11 items-center justify-between gap-3 rounded-md border border-white/10 bg-black/35 px-3">
          <dt className="text-[var(--pd-mist)]">Session</dt>
          <dd className="m-0 font-mono text-[var(--pd-paper)]">
            {active ? "active" : "signed out"}
          </dd>
        </div>
        <div className="flex min-h-11 items-center justify-between gap-3 rounded-md border border-white/10 bg-black/35 px-3">
          <dt className="text-[var(--pd-mist)]">Subject</dt>
          <dd className="m-0 truncate font-mono text-[var(--pd-paper)]">
            {username ?? "—"}
          </dd>
        </div>
        {expiryLabel ? (
          <div className="flex min-h-11 items-center justify-between gap-3 rounded-md border border-white/10 bg-black/35 px-3">
            <dt className="text-[var(--pd-mist)]">Expires</dt>
            <dd className="m-0 font-mono text-xs text-[var(--pd-paper)]">{expiryLabel}</dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleSignOut}
          disabled={!active}
          className="min-h-11 touch-manipulation rounded-md border border-[var(--pd-danger)]/40 bg-black/40 px-4 text-sm text-[var(--pd-danger)] backdrop-blur-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          Sign out
        </button>
        <button
          type="button"
          onClick={handleReAuth}
          className="min-h-11 touch-manipulation rounded-md border border-white/20 bg-black/35 px-4 text-sm text-[var(--pd-mist)] backdrop-blur-sm"
        >
          Re-auth
        </button>
      </div>

      {reAuthNote ? (
        <p className="mt-3 m-0 text-xs text-[var(--pd-mist)]" role="status">
          {reAuthNote}
        </p>
      ) : null}

      <p className="mt-3 m-0 font-mono text-xs text-[var(--pd-mist)]">
        module:<span className="text-[var(--pd-paper)]">identity</span> · CSS via{" "}
        <code className="text-[var(--pd-lime)]">src/lib/auth.ts</code>
      </p>
    </section>
  );
}
