"use client";

import { useEffect, useState } from "react";
import { AUTH_CONFIG } from "@/lib/config";
import {
  clearTokens,
  ensureFreshToken,
  getStoredUser,
  verifySession,
} from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";
import { DeckHome } from "@/components/DeckHome";

export default function HomePage() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [username, setUsername] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await ensureFreshToken(AUTH_CONFIG);
      const ok = await verifySession(AUTH_CONFIG);
      if (cancelled) return;
      setAuthed(ok);
      setUsername(getStoredUser()?.username);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function onLoggedIn() {
    setUsername(getStoredUser()?.username);
    setAuthed(true);
  }

  function onLogout() {
    clearTokens();
    setAuthed(false);
    setUsername(undefined);
  }

  if (!ready) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-4">
        <p className="text-[var(--pd-mist)]">Loading…</p>
      </main>
    );
  }

  if (!authed) {
    return <LoginForm onSuccess={onLoggedIn} />;
  }

  return <DeckHome username={username} onLogout={onLogout} />;
}
