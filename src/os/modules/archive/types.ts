export type EvidenceGate = "q1" | "q2";

export type ArchiveEvidenceLink = {
  gate: EvidenceGate;
  path: string;
  hdriveUrl: string;
};

export type ArchiveReleaseEntry = {
  name: string;
  rootPath: string;
  hdriveUrl: string;
  evidence: ArchiveEvidenceLink[];
};

export type ArchiveListResult =
  | {
      ok: true;
      root: string;
      proddeck: ArchiveReleaseEntry[];
      other: string[];
    }
  | {
      ok: false;
      code: "drive_missing" | "read_failed";
      message: string;
    };

/** Live VERSION pin from PREPROD (F:) or PROD (G:) apps\proddeck\VERSION. */
export type EnvVersionPin = {
  env: "PREPROD" | "PROD";
  drive: "F:" | "G:";
  path: string;
  /** Trimmed VERSION contents, or null when drive/file missing or unreadable. */
  version: string | null;
};

export type EnvVersionPinsResult = {
  pins: EnvVersionPin[];
};
