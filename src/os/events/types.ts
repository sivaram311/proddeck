export type OsEventType =
  | "dispatch.hire.requested"
  | "promote.decision"
  | "crew.fabric.spawned"
  | "crew.fabric.lane.done";

export type OsEventEnvelope = {
  type: OsEventType;
  at: string;
  env?: string;
  actor?: string;
  payload: Record<string, unknown>;
};
