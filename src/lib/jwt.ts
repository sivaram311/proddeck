import { createRemoteJWKSet, jwtVerify } from "jose";

const CLIENT_ID = "proddeck";

function cssBase(): string {
  return (process.env.CSS_AUTH_URL || "http://127.0.0.1:9000").replace(/\/$/, "");
}

function expectedIssuer(): string {
  const fromEnv = (process.env.NEXT_PUBLIC_CSS_ISSUER || "").trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  return cssBase();
}

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJwks() {
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(`${cssBase()}/.well-known/jwks.json`));
  }
  return jwks;
}

export type BearerResult =
  | { ok: true; sub?: string }
  | { ok: false; status: number; code: string; message: string };

/**
 * Require Authorization: Bearer <JWT>, verify RS256 via CSS JWKS,
 * enforce iss + aud/client_id=proddeck + exp.
 */
export async function verifyProdDeckBearer(
  authorization: string | null | undefined,
): Promise<BearerResult> {
  if (!authorization || !authorization.toLowerCase().startsWith("bearer ")) {
    return {
      ok: false,
      status: 401,
      code: "MISSING_BEARER",
      message: "Authorization Bearer required",
    };
  }
  const token = authorization.slice(7).trim();
  if (!token) {
    return {
      ok: false,
      status: 401,
      code: "MISSING_BEARER",
      message: "Authorization Bearer required",
    };
  }

  const issuer = expectedIssuer();
  try {
    const { payload } = await jwtVerify(token, getJwks(), {
      issuer,
      audience: CLIENT_ID,
      algorithms: ["RS256"],
    });
    const clientIdClaim = payload.client_id;
    if (typeof clientIdClaim === "string" && clientIdClaim !== CLIENT_ID) {
      return {
        ok: false,
        status: 401,
        code: "INVALID_TOKEN",
        message: "Token client_id mismatch",
      };
    }
    return { ok: true, sub: typeof payload.sub === "string" ? payload.sub : undefined };
  } catch (err) {
    // Fallback: some stacks only set client_id (jose aud check failed)
    try {
      const { payload } = await jwtVerify(token, getJwks(), {
        issuer,
        algorithms: ["RS256"],
      });
      const aud = payload.aud;
      const audOk = Array.isArray(aud)
        ? aud.includes(CLIENT_ID)
        : aud === CLIENT_ID;
      const clientOk = payload.client_id === CLIENT_ID;
      if (!audOk && !clientOk) {
        return {
          ok: false,
          status: 401,
          code: "INVALID_TOKEN",
          message: "Token audience mismatch",
        };
      }
      return { ok: true, sub: typeof payload.sub === "string" ? payload.sub : undefined };
    } catch {
      const msg = err instanceof Error ? err.message : "invalid token";
      return {
        ok: false,
        status: 401,
        code: "INVALID_TOKEN",
        message: msg.includes("exp") ? "Token expired" : "Invalid or unverifiable token",
      };
    }
  }
}
