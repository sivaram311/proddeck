import type { PortStopJob, PortReserveEnv } from "./types";
import { PORTS_ACTOR, envFromPort, type ReserveFlash } from "./requestReserve";

const STOP_HINT =
  "Do not kill from Cloud OS — hire a worker to stop the listener safely (no OS kill/stop API)";

export function buildPortStopJob(input: {
  port: number;
  appId: string;
  env: string;
  notes?: string;
}): PortStopJob {
  const env = normalizeEnv(input.env, input.port);
  return {
    kind: "ports.request_stop",
    port: input.port,
    appId: input.appId.trim() || "(unknown)",
    env,
    notes: input.notes?.trim() || undefined,
    stopHint: STOP_HINT,
    requestedAt: new Date().toISOString(),
  };
}

function normalizeEnv(raw: string, port?: number): PortReserveEnv {
  const v = raw.trim().toLowerCase();
  if (v === "dev" || v === "preprod" || v === "prod") return v;
  if (v === "development") return "dev";
  if (v === "production") return "prod";
  if (typeof port === "number") return envFromPort(port);
  return "dev";
}

/** Copy job JSON to clipboard, then POST dispatch.hire.requested. Soft-fails on either. */
export async function requestPortStop(job: PortStopJob): Promise<ReserveFlash> {
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
