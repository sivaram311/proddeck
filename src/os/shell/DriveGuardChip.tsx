"use client";

import type { OsEnv } from "../types";

const LABEL: Record<OsEnv, string> = {
  dev: "DEV · E:",
  preprod: "PREPROD · F:",
  prod: "PROD · G:",
  releases: "RELEASES · H:",
};

type Props = {
  env: OsEnv;
  onChange?: (env: OsEnv) => void;
};

/** Display + soft warn. Hard gates land in Wave 1 drive-guard lane. */
export function DriveGuardChip({ env, onChange }: Props) {
  return (
    <label className="inline-flex min-h-11 items-center gap-2 rounded-md border border-white/15 bg-black/45 px-2 text-xs text-[var(--pd-mist)] backdrop-blur-sm">
      <span className="text-[var(--pd-lime)]" style={{ fontFamily: "var(--font-display)" }}>
        Env
      </span>
      <select
        value={env}
        onChange={(e) => onChange?.(e.target.value as OsEnv)}
        className="min-h-9 rounded border-0 bg-transparent text-[var(--pd-paper)] outline-none"
        aria-label="Drive / environment guard"
      >
        {(Object.keys(LABEL) as OsEnv[]).map((k) => (
          <option key={k} value={k} className="bg-[var(--pd-ink)]">
            {LABEL[k]}
          </option>
        ))}
      </select>
    </label>
  );
}
