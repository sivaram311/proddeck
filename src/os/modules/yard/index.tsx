"use client";

import { useCallback, useMemo, useState } from "react";
import { FabricEventsTail } from "./FabricEventsTail";
import { MISSION_TEMPLATES, initialLaneState } from "./mission-templates";
import { publishQuayBeat } from "@/scene/keepers-quay/beats";
import { SKILL_PACKS } from "./skill-packs";
import { SkillRegistry } from "./SkillRegistry";
import {
  LANE_STATUS_LABEL,
  LANE_STATUS_ORDER,
  type LaneStatus,
  type MissionTemplate,
  type SkillPack,
} from "./types";

const FIELD_LESSONS_PATH = "E:\\MyAgent\\workflow\\promote\\field-lessons.md";
const ACTOR = "proddeck-yard";

const STATUS_COLOR: Record<LaneStatus, string> = {
  idle: "var(--pd-mist)",
  running: "var(--pd-lime)",
  done: "#7ec8a3",
  blocked: "var(--pd-danger)",
};

type HireFlash = "ok" | "soft-fail";

function nextStatus(current: LaneStatus): LaneStatus {
  const i = LANE_STATUS_ORDER.indexOf(current);
  return LANE_STATUS_ORDER[(i + 1) % LANE_STATUS_ORDER.length]!;
}

function buildBriefing(pack: SkillPack, mission: MissionTemplate): string {
  return [
    `Yard hire — ${pack.label}`,
    `Pack: ${pack.id}`,
    `Skills: ${pack.skills.join(", ")}`,
    `Mission: ${mission.title} (${mission.id})`,
    "Lane status stays manual until Portal runners exist — do not auto-start.",
    "Promote crews must hire promote-field-ops — see field-lessons.md.",
  ].join("\n");
}

export function YardView() {
  const [missionId, setMissionId] = useState(MISSION_TEMPLATES[0]!.id);
  const mission = useMemo(
    () => MISSION_TEMPLATES.find((m) => m.id === missionId) ?? MISSION_TEMPLATES[0]!,
    [missionId],
  );
  const [laneState, setLaneState] = useState<Record<string, LaneStatus>>(() =>
    initialLaneState(mission),
  );
  const [hireBusyId, setHireBusyId] = useState<string | null>(null);
  const [hireFlash, setHireFlash] = useState<{ packId: string; state: HireFlash } | null>(null);
  const [eventsRefreshToken, setEventsRefreshToken] = useState(0);
  const [runnerNote, setRunnerNote] = useState<string | null>(null);

  function selectMission(m: MissionTemplate) {
    setMissionId(m.id);
    setLaneState(initialLaneState(m));
  }

  function cycleLane(laneId: string) {
    setLaneState((prev) => ({
      ...prev,
      [laneId]: nextStatus(prev[laneId] ?? "idle"),
    }));
  }

  const hirePack = useCallback(
    async (pack: SkillPack) => {
      const briefing = buildBriefing(pack, mission);
      try {
        await navigator.clipboard.writeText(briefing);
      } catch {
        /* clipboard may be denied; still emit event */
      }

      setHireBusyId(pack.id);
      let eventOk = false;
      try {
        const res = await fetch("/api/os/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "crew.fabric.spawned",
            env: "dev",
            actor: ACTOR,
            payload: {
              packId: pack.id,
              skills: pack.skills,
              missionId: mission.id,
              briefing,
              source: "yard",
            },
          }),
        });
        eventOk = res.ok;
      } catch {
        eventOk = false;
      }

      const liveRes = await fetch("/api/os/yard/spawn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packId: pack.id,
          skills: pack.skills,
          brief: briefing,
          env: "dev",
          returnUrl:
            typeof window !== "undefined"
              ? `${window.location.origin}/?osPlace=watch`
              : "https://home.delena.buzz/?osPlace=watch",
        }),
      });
      const live = (await liveRes.json().catch(() => ({}))) as { message?: string };
      setRunnerNote(live.message ?? "spawn checked");
      publishQuayBeat({
        type: "fabric.ignite",
        lanes: pack.skills.map((skill, i) => ({ id: `${pack.id}-${i}`, skill })),
      });

      setHireBusyId(null);
      setHireFlash({ packId: pack.id, state: eventOk ? "ok" : "soft-fail" });
      if (eventOk) setEventsRefreshToken((n) => n + 1);
      window.setTimeout(() => setHireFlash(null), 2200);
    },
    [mission],
  );

  const oneTapPromoteQ2 = useCallback(async () => {
    const pack = SKILL_PACKS.find((p) => p.id === "promote-q2");
    if (!pack) return;
    const promoteMission =
      MISSION_TEMPLATES.find((m) => m.packId === "promote-q2") ?? mission;
    selectMission(promoteMission);
    await hirePack(pack);
    window.location.href = "/?osPlace=forge";
  }, [hirePack, mission]);

  return (
    <section className="flex flex-col gap-4" aria-label="Yard · Crew Fabric">
      <header>
        <p
          className="m-0 text-base text-[var(--pd-lime)]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
        >
          Yard · Crew Fabric
        </p>
        <p className="mt-1 m-0 text-sm text-[var(--pd-mist)]">
          Hire skill packs from the phone — live Portal runners stay flag-gated OFF.
        </p>
      </header>

      <button
        type="button"
        onClick={() => void oneTapPromoteQ2()}
        className="min-h-11 rounded-lg border border-[var(--pd-lime)]/50 bg-[var(--pd-lime)]/15 px-4 text-sm font-semibold text-[var(--pd-lime)]"
      >
        One-tap Promote Q2 → Yard hire + Promote place
      </button>

      {runnerNote ? (
        <p className="m-0 text-xs text-[var(--pd-mist)]" role="status">
          {runnerNote}
        </p>
      ) : null}

      <div
        className="rounded-md border border-[var(--pd-lime)]/35 bg-[var(--pd-lime)]/8 px-3 py-2 text-xs text-[var(--pd-mist)]"
        role="note"
        aria-label="Field-ops tip"
      >
        <span className="text-[var(--pd-lime)]">Field-ops tip:</span> hire{" "}
        <code className="text-[var(--pd-paper)]">promote-field-ops</code> on every promote crew
        (bind race, CF cache, PS traps, serial ACTIVITY-LOG) —{" "}
        <code className="break-all text-[var(--pd-paper)]">{FIELD_LESSONS_PATH}</code>
      </div>

      <div className="flex flex-col gap-2" role="list" aria-label="Mission templates">
        {MISSION_TEMPLATES.map((m) => {
          const active = m.id === mission.id;
          return (
            <button
              key={m.id}
              type="button"
              role="listitem"
              onClick={() => selectMission(m)}
              className={`min-h-11 rounded-lg border px-3 py-3 text-left backdrop-blur-md ${
                active
                  ? "border-[var(--pd-lime)]/50 bg-[var(--pd-lime)]/10"
                  : "border-white/10 bg-black/55"
              }`}
            >
              <p className="m-0 text-sm font-semibold text-[var(--pd-paper)]">{m.title}</p>
              <p className="mt-1 m-0 text-xs text-[var(--pd-mist)]">
                {m.env.toUpperCase()} · {m.packId} · {m.lanes.length} lanes
              </p>
            </button>
          );
        })}
      </div>

      <article className="rounded-lg border border-white/10 bg-black/55 p-4 backdrop-blur-md">
        <p className="m-0 text-sm font-semibold text-[var(--pd-paper)]">{mission.title}</p>
        <p className="mt-2 m-0 text-sm text-[var(--pd-mist)]">{mission.goal}</p>
        <ul className="mt-4 m-0 flex list-none flex-col gap-2 p-0" aria-label="Lane board">
          {mission.lanes.map((lane) => {
            const status = laneState[lane.id] ?? "idle";
            return (
              <li key={lane.id}>
                <button
                  type="button"
                  onClick={() => cycleLane(lane.id)}
                  className="flex min-h-11 w-full items-center justify-between gap-3 rounded-md border border-white/10 bg-black/40 px-3 py-2 text-left"
                  aria-label={`${lane.label} status ${LANE_STATUS_LABEL[status]}, tap to cycle`}
                >
                  <div className="min-w-0">
                    <p className="m-0 truncate text-sm text-[var(--pd-paper)]">{lane.label}</p>
                    <p className="mt-0.5 m-0 truncate text-xs text-[var(--pd-mist)]">{lane.job}</p>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ color: STATUS_COLOR[status], border: `1px solid ${STATUS_COLOR[status]}` }}
                  >
                    {LANE_STATUS_LABEL[status]}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 m-0 text-xs text-[var(--pd-mist)]">Tap a lane to cycle idle → running → done → blocked.</p>
      </article>

      <section aria-label="Skill packs">
        <p
          className="m-0 text-sm text-[var(--pd-paper)]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
        >
          Skill packs
        </p>
        <ul className="mt-2 m-0 flex list-none flex-col gap-2 p-0">
          {SKILL_PACKS.map((pack) => {
            const flash = hireFlash?.packId === pack.id ? hireFlash.state : null;
            const isPromote = pack.id === "promote-q1" || pack.id === "promote-q2";
            return (
              <li
                key={pack.id}
                className="rounded-lg border border-white/10 bg-black/55 px-3 py-3 backdrop-blur-md"
              >
                <p className="m-0 text-sm font-semibold text-[var(--pd-lime)]">{pack.label}</p>
                <p className="mt-1 m-0 text-xs text-[var(--pd-mist)]">{pack.blurb}</p>
                <p className="mt-2 m-0 font-mono text-[10px] leading-relaxed text-[var(--pd-mist)]">
                  {pack.skills.join(" · ")}
                </p>
                {isPromote ? (
                  <p className="mt-2 m-0 text-[10px] text-[var(--pd-mist)]">
                    Includes <code className="text-[var(--pd-paper)]">promote-field-ops</code> — required
                    on promote crews.
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void hirePack(pack)}
                    disabled={hireBusyId === pack.id}
                    className="min-h-11 rounded-md bg-[var(--pd-lime)] px-4 text-sm font-semibold text-[var(--pd-ink)] disabled:opacity-50"
                  >
                    {hireBusyId === pack.id ? "Hiring…" : "Hire"}
                  </button>
                  {flash === "ok" ? (
                    <span className="text-xs text-[var(--pd-lime)]" role="status">
                      Copied · event emitted
                    </span>
                  ) : null}
                  {flash === "soft-fail" ? (
                    <span className="text-xs text-[var(--pd-danger)]" role="status">
                      Copied · event soft-fail
                    </span>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <FabricEventsTail refreshToken={eventsRefreshToken} />

      <SkillRegistry />
    </section>
  );
}
