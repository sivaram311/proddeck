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
