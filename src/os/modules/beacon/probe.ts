import net from "net";
import type { BeaconRow, BeaconSnapshot, BeaconTarget } from "./types";

export type { BeaconRow, BeaconSnapshot, BeaconTarget } from "./types";

const PING_MS = 2000;

export const BEACON_TARGETS: BeaconTarget[] = [
  { id: "home", label: "home.delena.buzz", kind: "http", url: "https://home.delena.buzz/" },
  { id: "home-staging", label: "home-staging", kind: "http", url: "https://home-staging.delena.buzz/" },
  { id: "css", label: "CSS JWKS", kind: "http", url: "http://127.0.0.1:5900/.well-known/jwks.json" },
  { id: "portal", label: "Agent Portal :5080", kind: "tcp", host: "127.0.0.1", port: 5080 },
  { id: "agentverse", label: "AgentVerse :5310", kind: "tcp", host: "127.0.0.1", port: 5310 },
  { id: "agentverse-v2", label: "AgentVerse v2 :5311", kind: "tcp", host: "127.0.0.1", port: 5311 },
  { id: "hdrive", label: "H-Drive :5010", kind: "tcp", host: "127.0.0.1", port: 5010 },
  { id: "proddeck", label: "ProdDeck :5320", kind: "tcp", host: "127.0.0.1", port: 5320 },
];

function tcpOk(host: string, port: number, ms = PING_MS): Promise<{ ok: boolean; ms: number }> {
  const started = Date.now();
  return new Promise((resolve) => {
    const socket = net.connect({ host, port });
    const done = (ok: boolean) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve({ ok, ms: Date.now() - started });
    };
    socket.setTimeout(ms);
    socket.once("connect", () => done(true));
    socket.once("timeout", () => done(false));
    socket.once("error", () => done(false));
  });
}

async function httpOk(url: string): Promise<{ ok: boolean; ms: number; detail?: string }> {
  const started = Date.now();
  try {
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(PING_MS),
      redirect: "manual",
    });
    return { ok: res.status > 0 && res.status < 500, ms: Date.now() - started, detail: `HTTP ${res.status}` };
  } catch (err) {
    return { ok: false, ms: Date.now() - started, detail: err instanceof Error ? err.message : "fail" };
  }
}

export async function collectBeaconSnapshot(): Promise<BeaconSnapshot> {
  const rows: BeaconRow[] = await Promise.all(
    BEACON_TARGETS.map(async (t) => {
      if (t.kind === "http" && t.url) {
        const r = await httpOk(t.url);
        return { ...t, ok: r.ok, ms: r.ms, detail: r.detail };
      }
      if (t.host && t.port) {
        const r = await tcpOk(t.host, t.port);
        return { ...t, ok: r.ok, ms: r.ms, detail: r.ok ? "LISTEN" : "down" };
      }
      return { ...t, ok: false, detail: "misconfigured" };
    }),
  );
  return { at: new Date().toISOString(), rows };
}
