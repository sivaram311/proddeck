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

/** Display + soft warn. Hard gates: see modules/drive-guard/confirm.ts */
export function DriveGuardChip({ env, onChange }: Props) {
  const hot = env === "prod" || env === "releases";
  return (
    <label
      className={`inline-flex min-h-11 items-center gap-2 rounded-md border bg-black/45 px-2 text-xs text-[var(--pd-mist)] backdrop-blur-sm ${
        hot ? "border-[var(--pd-danger)]/50" : "border-white/15"
      }`}
    >
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
