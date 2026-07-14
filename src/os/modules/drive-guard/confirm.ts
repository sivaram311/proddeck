import type { OsEnv } from "../../types";

const DESTRUCTIVE: OsEnv[] = ["prod", "releases"];

/** True when env chip is PROD or RELEASES — UI should require typed confirm. */
export function isDestructiveEnv(env: OsEnv): boolean {
  return DESTRUCTIVE.includes(env);
}

export function expectedConfirmPhrase(env: OsEnv): string {
  if (env === "prod") return "PROD";
  if (env === "releases") return "RELEASES";
  return "";
}

/**
 * Soft gate for phone UI. Returns null if ok, or error string.
 * Does not perform any drive IO.
 */
export function requireEnvConfirm(env: OsEnv, typed: string, actionLabel: string): string | null {
  if (!isDestructiveEnv(env)) return null;
  const expect = expectedConfirmPhrase(env);
  if (typed.trim() !== expect) {
    return `Type ${expect} to confirm ${actionLabel} under ${env.toUpperCase()}.`;
  }
  return null;
}
