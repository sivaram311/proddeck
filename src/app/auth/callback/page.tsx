"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AUTH_CONFIG } from "@/lib/config";
import { completeCssOAuthCallback, verifySession } from "@/lib/auth";

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await completeCssOAuthCallback(AUTH_CONFIG, {
          code: params.get("code"),
          state: params.get("state"),
          error: params.get("error"),
        });
        const ok = await verifySession(AUTH_CONFIG);
        if (!ok) throw new Error("Token accepted but session check failed");
        if (!cancelled) router.replace("/");
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "OAuth callback failed");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params, router]);

  return (
    <main className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-4">
      {error ? (
        <p className="max-w-md text-center text-sm text-[var(--pd-danger)]" role="alert">
          {error}
        </p>
      ) : (
        <p className="text-sm text-[var(--pd-mist)]">Completing CSS sign-in…</p>
      )}
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-dvh items-center justify-center text-sm text-[var(--pd-mist)]">
          Completing CSS sign-in…
        </main>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
