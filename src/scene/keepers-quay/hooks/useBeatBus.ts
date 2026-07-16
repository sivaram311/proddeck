"use client";

import { useEffect, useState } from "react";
import { subscribeQuayBeats, type QuayBeat } from "../beats";

export type QuayQuality = "low" | "med" | "high";

export function resolveQuayQuality(): QuayQuality {
  if (typeof window === "undefined") return "low";
  const q = new URLSearchParams(window.location.search).get("quayQuality");
  if (q === "low" || q === "med" || q === "high") return q;
  try {
    const stored = localStorage.getItem("prodDeckQuayQuality");
    if (stored === "low" || stored === "med" || stored === "high") return stored;
  } catch {
    /* ignore */
  }
  const w = window.innerWidth;
  if (w <= 420) return "low";
  if (w <= 900) return "med";
  return "high";
}

export function useQuayQuality(): QuayQuality {
  const [q, setQ] = useState<QuayQuality>("low");
  useEffect(() => {
    setQ(resolveQuayQuality());
  }, []);
  return q;
}

export function useBeatBus(onBeat?: (beat: QuayBeat) => void): QuayBeat | null {
  const [last, setLast] = useState<QuayBeat | null>(null);
  useEffect(() => {
    return subscribeQuayBeats((beat) => {
      setLast(beat);
      onBeat?.(beat);
    });
  }, [onBeat]);
  return last;
}
