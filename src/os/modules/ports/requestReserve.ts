import type { PortReserveJob, PortReserveEnv } from "./types";

export const PORTS_ACTOR = "proddeck-ports";

const REGISTRY_HINT =
  "Add to E:\\MyAgent\\workflow\\ports\\REGISTRY.md + registry.json";

export function buildPortReserveJob(input: {
  port: number;
  appId: string;
  env: string;
  notes?: string;
}): PortReserveJob {
  const env = normalizeEnv(input.env, input.port);
  return {
    kind: "ports.reserve",
    port: input.port,
    appId: input.appId.trim() || "(unknown)",
    env,
    notes: input.notes?.trim() || undefined,
    registryHint: REGISTRY_HINT,
    requestedAt: new Date().toISOString(),
  };
}

export function envFromPort(port: number): PortReserveEnv {
  if (port >= 5000 && port < 6000) return "prod";
  if (port >= 4000 && port < 5000) return "preprod";
  return "dev";
}

function normalizeEnv(raw: string, port?: number): PortReserveEnv {
  const v = raw.trim().toLowerCase();
  if (v === "dev" || v === "preprod" || v === "prod") return v;
  if (v === "development") return "dev";
  if (v === "production") return "prod";
  if (typeof port === "number") return envFromPort(port);
  return "dev";
}

export type ReserveFlash = "idle" | "copied" | "queued" | "soft-fail";

/** Copy job JSON to clipboard, then POST dispatch.hire.requested. Soft-fails on either. */
export async function requestPortReserve(job: PortReserveJob): Promise<ReserveFlash> {
  let copied = false;
  try {
    await navigator.clipboard.writeText(JSON.stringify(job, null, 2));
    copied = true;
  } catch {
    /* clipboard may be denied — still try queue */
  }

  let queued = false;
  try {
    const res = await fetch("/api/os/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "dispatch.hire.requested",
        env: job.env,
        actor: PORTS_ACTOR,
        payload: job,
      }),
    });
    queued = res.ok;
  } catch {
    queued = false;
  }

  if (queued) return "queued";
  if (copied) return "copied";
  return "soft-fail";
}

export function flashLabel(flash: ReserveFlash): string | null {
  if (flash === "queued") return "Queued";
  if (flash === "copied") return "Copied";
  if (flash === "soft-fail") return "Soft-fail";
  return null;
}
