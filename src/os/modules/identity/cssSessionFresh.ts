"use client";

import { useCallback, useEffect, useState } from "react";
import { AUTH_CONFIG } from "@/lib/config";
import {
  decodeJwtPayload,
  ensureFreshToken,
  getAccessToken,
  getStoredUser,
  verifySession,
} from "@/lib/auth";

/** Vault place — CSS sign-in / session strip. */
export const CSS_REAUTH_HREF = "/?osPlace=vault";

export type CssSessionFreshProbe = {
  fresh: boolean;
  subject?: string;
  /** Access-token `exp` (unix seconds), when available. */
  expiry?: number;
};

/**
 * CSS session freshness probe (not localStorage-only).
 * Runs `ensureFreshToken` + `verifySession` against AUTH_CONFIG (clientId proddeck).
 */
export async function probeCssSessionFresh(): Promise<CssSessionFreshProbe> {
  await ensureFreshToken(AUTH_CONFIG);
  const fresh = await verifySession(AUTH_CONFIG);
  if (!fresh) return { fresh: false };

  const user = getStoredUser();
  const token = getAccessToken();
  const claims = token ? decodeJwtPayload(token) : null;
  const subject = user?.username ?? claims?.sub ?? undefined;
  const expiry = claims?.exp;

  return { fresh: true, subject, expiry };
}

export type CssSessionFreshState = CssSessionFreshProbe & {
  /** False until the first probe settles. */
  ready: boolean;
  /** Re-run the CSS probe. */
  refresh: () => void;
};

/** Mount + on-demand CSS session freshness for Identity / Promote. */
export function useCssSessionFresh(): CssSessionFreshState {
  const [ready, setReady] = useState(false);
  const [fresh, setFresh] = useState(false);
  const [subject, setSubject] = useState<string | undefined>();
  const [expiry, setExpiry] = useState<number | undefined>();

  const refresh = useCallback(() => {
    void (async () => {
      const result = await probeCssSessionFresh();
      setFresh(result.fresh);
      setSubject(result.subject);
      setExpiry(result.expiry);
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { fresh, subject, expiry, ready, refresh };
}

/** Open Vault (Identity) for CSS re-auth; falls back to Quay home login. */
export function openCssReAuth(onReAuth?: () => void): void {
  if (onReAuth) {
    onReAuth();
    return;
  }
  if (typeof window === "undefined") return;
  window.location.assign(CSS_REAUTH_HREF);
}
