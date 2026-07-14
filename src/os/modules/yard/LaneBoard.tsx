"use client";

import type { LaneStatus, MissionLane } from "./types";
import { LANE_STATUS_LABEL, LANE_STATUS_ORDER } from "./types";

const STATUS_STYLE: Record<
  LaneStatus,
  { bg: string; color: string; border: string }
> = {
  idle: {
    bg: "rgba(255,255,255,0.06)",
    color: "var(--pd-mist)",
    border: "rgba(255,255,255,0.12)",
  },
  running: {
    bg: "rgba(184,240,0,0.12)",
    color: "var(--pd-lime)",
    border: "rgba(184,240,0,0.35)",
  },
  done: {
    bg: "rgba(120,200,160,0.12)",
    color: "#78c8a0",
    border: "rgba(120,200,160,0.35)",
  },
  blocked: {
    bg: "rgba(255,92,92,0.12)",
    color: "var(--pd-danger)",
    border: "rgba(255,92,92,0.35)",
  },
};

function nextStatus(current: LaneStatus): LaneStatus {
  const idx = LANE_STATUS_ORDER.indexOf(current);
  return LANE_STATUS_ORDER[(idx + 1) % LANE_STATUS_ORDER.length];
}

type LaneCardProps = {
  lane: MissionLane;
  status: LaneStatus;
  onStatusChange: (status: LaneStatus) => void;
};

export function LaneCard({ lane, status, onStatusChange }: LaneCardProps) {
  const style = STATUS_STYLE[status];

  return (
    <article
      className="rounded-lg border bg-black/55 p-4 backdrop-blur-md"
      style={{ borderColor: style.border }}
      aria-label={`${lane.label} lane — ${LANE_STATUS_LABEL[status]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="m-0 font-mono text-sm font-semibold text-[var(--pd-lime)]">{lane.label}</p>
          <p className="mt-1 m-0 text-xs text-[var(--pd-mist)]">{lane.job}</p>
        </div>
        <button
          type="button"
          onClick={() => onStatusChange(nextStatus(status))}
          className="min-h-[44px] shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition hover:brightness-110"
          style={{
            backgroundColor: style.bg,
            color: style.color,
            border: `1px solid ${style.border}`,
          }}
          aria-label={`${lane.label} status ${LANE_STATUS_LABEL[status]}. Tap to cycle.`}
        >
          {LANE_STATUS_LABEL[status]}
        </button>
      </div>
    </article>
  );
}

type LaneBoardProps = {
  lanes: MissionLane[];
  laneState: Record<string, LaneStatus>;
  onLaneStatusChange: (laneId: string, status: LaneStatus) => void;
};

export function LaneBoard({ lanes, laneState, onLaneStatusChange }: LaneBoardProps) {
  return (
    <div className="grid grid-cols-1 gap-3" role="list" aria-label="Skill lanes">
      {lanes.map((lane) => (
        <LaneCard
          key={lane.id}
          lane={lane}
          status={laneState[lane.id] ?? "idle"}
          onStatusChange={(status) => onLaneStatusChange(lane.id, status)}
        />
      ))}
    </div>
  );
}
