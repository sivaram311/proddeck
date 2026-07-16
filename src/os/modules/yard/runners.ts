import { OS_FLAGS } from "@/os/flags";

export type RunnerLaneStatus = "queued" | "running" | "blocked" | "done" | "failed";

export type SpawnLane = {
  id: string;
  skill: string;
  status: RunnerLaneStatus;
  message?: string;
};

/**
 * Live Portal runner spawn — flag OFF keeps soft events only.
 * When ON, attempts Portal os-events / session hire; on failure lanes → blocked.
 */
export async function spawnLiveRunners(input: {
  packId: string;
  skills: string[];
  brief: string;
  env: string;
  returnUrl: string;
  portalBase?: string;
}): Promise<{
  flagOn: boolean;
  spawned: boolean;
  lanes: SpawnLane[];
  message: string;
}> {
  if (!OS_FLAGS.yardLiveRunners()) {
    return {
      flagOn: false,
      spawned: false,
      lanes: input.skills.map((skill, i) => ({
        id: `${input.packId}-${i}`,
        skill,
        status: "queued" as const,
        message: "soft-event only (OS_YARD_LIVE_RUNNERS=0)",
      })),
      message: "Live runners disabled — hire remains clipboard + os-event.",
    };
  }

  const base =
    (input.portalBase || process.env.PLATFORM_APPS_URL || process.env.NEXT_PUBLIC_PORTAL_URL || "")
      .trim()
      .replace(/\/$/, "");

  if (!base) {
    return {
      flagOn: true,
      spawned: false,
      lanes: input.skills.map((skill, i) => ({
        id: `${input.packId}-${i}`,
        skill,
        status: "blocked" as const,
        message: "PORTAL_URL missing",
      })),
      message: "Portal base URL not configured — lanes blocked; use Dispatch.",
    };
  }

  try {
    const res = await fetch(`${base}/api/os-events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "crew.fabric.spawned",
        env: input.env,
        actor: "proddeck-yard",
        payload: {
          packId: input.packId,
          skills: input.skills,
          brief: input.brief.slice(0, 2000),
          returnUrl: input.returnUrl,
          live: true,
        },
      }),
    });

    if (!res.ok) {
      return {
        flagOn: true,
        spawned: false,
        lanes: input.skills.map((skill, i) => ({
          id: `${input.packId}-${i}`,
          skill,
          status: "blocked" as const,
          message: `Portal HTTP ${res.status}`,
        })),
        message: "Portal spawn failed — send leftovers to AgentVerse.",
      };
    }

    return {
      flagOn: true,
      spawned: true,
      lanes: input.skills.map((skill, i) => ({
        id: `${input.packId}-${i}`,
        skill,
        status: "running" as const,
      })),
      message: "Portal accepted crew.fabric.spawned",
    };
  } catch (err) {
    return {
      flagOn: true,
      spawned: false,
      lanes: input.skills.map((skill, i) => ({
        id: `${input.packId}-${i}`,
        skill,
        status: "blocked" as const,
        message: err instanceof Error ? err.message : "fetch failed",
      })),
      message: "Portal unreachable — use Dispatch deep-link.",
    };
  }
}
