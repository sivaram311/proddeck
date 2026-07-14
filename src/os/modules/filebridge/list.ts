import { access, readdir } from "fs/promises";
import path from "path";

/** List API is jailed here — never H:\ root or other drives. */
export const RELEASES_ROOT = "H:\\releases";

export type FileBridgeEntry = {
  name: string;
  path: string;
  rel: string;
  kind: "dir" | "file";
};

export type FileBridgeListOk = {
  ok: true;
  root: string;
  rel: string;
  entries: FileBridgeEntry[];
};

export type FileBridgeListErr = {
  ok: false;
  error:
    | "path_denied"
    | "drive_missing"
    | "not_found"
    | "not_directory"
    | "list_failed";
  message: string;
  status: 400 | 403 | 404 | 500;
};

export type FileBridgeListResult = FileBridgeListOk | FileBridgeListErr;

const SEPARATOR = /[/\\]+/g;

/**
 * Normalize a client path to a relative segment under H:\releases.
 * Rejects traversal, absolute escapes, and drive letters.
 */
export function normalizeReleasesRel(raw: string | null | undefined): string | null {
  const input = (raw ?? "").trim();
  if (!input || input === "." || input === "./" || input === ".\\") return "";

  let cleaned = input.replace(SEPARATOR, "\\");
  // Allow pasting full Windows path if still under releases
  if (/^[a-zA-Z]:\\/i.test(cleaned)) {
    const lower = cleaned.toLowerCase();
    const rootLower = RELEASES_ROOT.toLowerCase();
    if (lower === rootLower || lower.startsWith(rootLower + "\\")) {
      cleaned = cleaned.slice(RELEASES_ROOT.length).replace(/^\\+/, "");
    } else {
      return null;
    }
  }

  cleaned = cleaned.replace(/^\\+/, "").replace(/\\+$/, "");
  if (!cleaned) return "";

  const parts = cleaned.split("\\").filter(Boolean);
  const safe: string[] = [];
  for (const part of parts) {
    if (part === "." || part === "") continue;
    if (part === ".." || part.includes(":") || part === "...") return null;
    safe.push(part);
  }
  return safe.join("\\");
}

function assertInsideReleases(abs: string): boolean {
  const resolved = path.resolve(abs);
  const rootResolved = path.resolve(RELEASES_ROOT);
  const lower = resolved.toLowerCase();
  const rootLower = rootResolved.toLowerCase();
  return lower === rootLower || lower.startsWith(`${rootLower}\\`);
}

async function pathExists(target: string): Promise<boolean> {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

export async function listReleasesPath(
  rawPath: string | null | undefined,
): Promise<FileBridgeListResult> {
  const rel = normalizeReleasesRel(rawPath);
  if (rel === null) {
    return {
      ok: false,
      error: "path_denied",
      message:
        "Path denied — FileBridge list is jailed under H:\\releases (no traversal or other drives).",
      status: 403,
    };
  }

  if (!(await pathExists(RELEASES_ROOT))) {
    return {
      ok: false,
      error: "drive_missing",
      message:
        "H:\\releases is not available on this host. Connect the RELEASES drive (H:) or use Open H-Drive.",
      status: 404,
    };
  }

  const abs = rel ? path.resolve(RELEASES_ROOT, rel) : path.resolve(RELEASES_ROOT);
  if (!assertInsideReleases(abs)) {
    return {
      ok: false,
      error: "path_denied",
      message: "Path denied — resolved location is outside H:\\releases.",
      status: 403,
    };
  }

  if (!(await pathExists(abs))) {
    return {
      ok: false,
      error: "not_found",
      message: `Not found under H:\\releases: ${rel || "(root)"}`,
      status: 404,
    };
  }

  try {
    const names = await readdir(abs, { withFileTypes: true });
    const entries: FileBridgeEntry[] = names
      .slice(0, 200)
      .map((d) => {
        const name = d.name;
        const childAbs = path.join(abs, name);
        const childRel = rel ? `${rel}\\${name}` : name;
        return {
          name,
          path: childAbs,
          rel: childRel,
          kind: d.isDirectory() ? ("dir" as const) : ("file" as const),
        };
      })
      .sort((a, b) => {
        if (a.kind !== b.kind) return a.kind === "dir" ? -1 : 1;
        return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
      });

    return {
      ok: true,
      root: abs,
      rel,
      entries,
    };
  } catch (err) {
    const code =
      err && typeof err === "object" && "code" in err
        ? String((err as { code?: string }).code)
        : "";
    if (code === "ENOTDIR") {
      return {
        ok: false,
        error: "not_directory",
        message: "Path is a file, not a directory — open parent or use Open H-Drive.",
        status: 400,
      };
    }
    const detail = err instanceof Error ? err.message : "readdir failed";
    return {
      ok: false,
      error: "list_failed",
      message: `Could not list H:\\releases\\${rel || ""}. ${detail}`,
      status: 500,
    };
  }
}
