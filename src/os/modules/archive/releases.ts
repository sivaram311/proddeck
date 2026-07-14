import { access, readdir } from "fs/promises";
import path from "path";
import type { ArchiveEvidenceLink, ArchiveListResult, ArchiveReleaseEntry } from "./types";

const RELEASES_ROOT = "H:\\releases";
const HDRIVE_BASE = "https://hdrive.delena.buzz";

function toHdriveUrl(winPath: string): string {
  const rel = winPath.replace(/^H:\\/i, "").replace(/\\/g, "/");
  return `${HDRIVE_BASE}/${rel}${rel.endsWith("/") ? "" : "/"}`;
}

function parseProddeckVersion(name: string): number[] | null {
  const m = /^proddeck-(\d+)\.(\d+)\.(\d+)/i.exec(name);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function compareProddeckNames(a: string, b: string): number {
  const va = parseProddeckVersion(a);
  const vb = parseProddeckVersion(b);
  if (!va && !vb) return b.localeCompare(a);
  if (!va) return 1;
  if (!vb) return -1;
  for (let i = 0; i < 3; i += 1) {
    if (va[i] !== vb[i]) return vb[i] - va[i];
  }
  return b.localeCompare(a);
}

async function pathExists(target: string): Promise<boolean> {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

async function evidenceLinks(releaseName: string): Promise<ArchiveEvidenceLink[]> {
  const links: ArchiveEvidenceLink[] = [];
  for (const gate of ["q1", "q2"] as const) {
    const winPath = path.join(RELEASES_ROOT, releaseName, "evidence", gate);
    if (await pathExists(winPath)) {
      links.push({
        gate,
        path: winPath,
        hdriveUrl: toHdriveUrl(winPath),
      });
    }
  }
  return links;
}

export async function listArchiveReleases(): Promise<ArchiveListResult> {
  if (!(await pathExists(RELEASES_ROOT))) {
    return {
      ok: false,
      code: "drive_missing",
      message:
        "H:\\releases is not available on this host. Connect the RELEASES drive (H:) or open evidence via H-Drive SSO.",
    };
  }

  let names: string[];
  try {
    const entries = await readdir(RELEASES_ROOT, { withFileTypes: true });
    names = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return {
      ok: false,
      code: "read_failed",
      message: "Could not read H:\\releases. Check drive permissions and try again.",
    };
  }

  const proddeckNames = names.filter((n) => n.toLowerCase().startsWith("proddeck-")).sort(compareProddeckNames);
  const other = names.filter((n) => !n.toLowerCase().startsWith("proddeck-")).sort((a, b) => b.localeCompare(a));

  const proddeck: ArchiveReleaseEntry[] = [];
  for (const name of proddeckNames) {
    const rootPath = path.join(RELEASES_ROOT, name);
    proddeck.push({
      name,
      rootPath,
      hdriveUrl: toHdriveUrl(rootPath),
      evidence: await evidenceLinks(name),
    });
  }

  return { ok: true, root: RELEASES_ROOT, proddeck, other };
}
