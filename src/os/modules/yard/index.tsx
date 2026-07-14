"use client";

import { useMemo, useState } from "react";
import { MISSION_TEMPLATES, initialLaneState } from "./mission-templates";
import { PROMOTE_SKILL_IDS, PROMOTE_SKILL_LABEL, SKILL_PACKS } from "./skill-packs";
import {
  LANE_STATUS_LABEL,
  LANE_STATUS_ORDER,
  type LaneStatus,
  type MissionTemplate,
} from "./types";

const STATUS_COLOR: Record<LaneStatus, string> = {
  idle: "var(--pd-mist)",
  running: "var(--pd-lime)",
  done: "#7ec8a3",
  blocked: "var(--pd-danger)",
};

function nextStatus(current: LaneStatus): LaneStatus {
  const i = LANE_STATUS_ORDER.indexOf(current);
  return LANE_STATUS_ORDER[(i + 1) % LANE_STATUS_ORDER.length]!;
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
          Hire skill packs from the phone — Wave 1 board is manual status only.
        </p>
      </header>

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
          {SKILL_PACKS.map((pack) => (
            <li
              key={pack.id}
              className="rounded-lg border border-white/10 bg-black/55 px-3 py-3 backdrop-blur-md"
            >
              <p className="m-0 text-sm font-semibold text-[var(--pd-lime)]">{pack.label}</p>
              <p className="mt-1 m-0 text-xs text-[var(--pd-mist)]">{pack.blurb}</p>
              <p className="mt-2 m-0 font-mono text-[10px] leading-relaxed text-[var(--pd-mist)]">
                {pack.skills.join(" · ")}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Promote skills legend">
        <p className="m-0 text-xs font-semibold uppercase tracking-wide text-[var(--pd-mist)]">
          Promote skills
        </p>
        <ul className="mt-2 m-0 list-none space-y-1 p-0">
          {PROMOTE_SKILL_IDS.map((id) => (
            <li key={id} className="min-h-11 rounded-md border border-white/10 bg-black/40 px-3 py-2">
              <p className="m-0 font-mono text-xs text-[var(--pd-lime)]">{id}</p>
              <p className="mt-0.5 m-0 text-xs text-[var(--pd-mist)]">{PROMOTE_SKILL_LABEL[id]}</p>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
