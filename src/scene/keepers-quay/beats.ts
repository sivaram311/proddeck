/** Quay beat bus — product → scene (pure subscriber). */

export type QuayBeat =
  | { type: "wake.call"; slug: string }
  | { type: "wake.promote"; decision: "GO" | "HOLD" | "NEED_EVIDENCE" }
  | { type: "fabric.ignite"; lanes: { id: string; skill: string }[] }
  | {
      type: "fabric.lane";
      id: string;
      status: "queued" | "running" | "blocked" | "done" | "failed";
    }
  | { type: "fresh.vault"; fresh: boolean }
  | { type: "pulse.tide"; drives: Record<"E" | "F" | "G" | "H", number> }
  | { type: "ports.rope"; rows: { port: number; mismatch: string }[] }
  | { type: "webgl.fail" };

type Listener = (beat: QuayBeat) => void;

const listeners = new Set<Listener>();

export function publishQuayBeat(beat: QuayBeat): void {
  for (const fn of listeners) {
    try {
      fn(beat);
    } catch {
      /* ignore subscriber errors */
    }
  }
}

export function subscribeQuayBeats(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
