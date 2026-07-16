import { access, lstat, unlink } from "fs/promises";
import path from "path";
import { OS_FLAGS } from "@/os/flags";
import { appendActivityQueueRow } from "@/os/modules/activity-log/queue";
import { normalizeReleasesRel, RELEASES_ROOT } from "./list";

export const DELETE_CONFIRM_PHRASE = "DELETE_RELEASE_FILE";

export type FileBridgeDeleteOk = {
  ok: true;
  rel: string;
  abs: string;
};

export type FileBridgeDeleteErr = {
  ok: false;
  error: string;
  code?: string;
  message: string;
  status: number;
};

export type FileBridgeDeleteResult = FileBridgeDeleteOk | FileBridgeDeleteErr;

function assertInsideReleases(abs: string): boolean {
  const resolved = path.resolve(abs);
  const rootResolved = path.resolve(RELEASES_ROOT);
  const lower = resolved.toLowerCase();
  const rootLower = rootResolved.toLowerCase();
  return lower === rootLower || lower.startsWith(`${rootLower}\\`);
}

/**
 * Delete a single file under H:\releases only.
 * Flag OFF → conscious_no_delete. Never deletes directories.
 */
export async function deleteReleaseFile(input: {
  rel: string;
  confirmName: string;
  confirmPhrase: string;
}): Promise<FileBridgeDeleteResult> {
  if (!OS_FLAGS.filebridgeDelete()) {
    return {
      ok: false,
      error: "blocked",
      code: "conscious_no_delete",
      message:
        "Deletes blocked — OS_FILEBRIDGE_DELETE=0 (default). EM GO + flag required.",
      status: 403,
    };
  }

  if (input.confirmPhrase !== DELETE_CONFIRM_PHRASE) {
    return {
      ok: false,
      error: "confirm_required",
      code: "confirm_required",
      message: `Type exact phrase ${DELETE_CONFIRM_PHRASE}`,
      status: 400,
    };
  }

  const rel = normalizeReleasesRel(input.rel);
  if (rel === null || rel === "") {
    return {
      ok: false,
      error: "path_denied",
      code: "path_denied",
      message: "Path denied — must be a relative file under H:\\releases",
      status: 403,
    };
  }

  const basenames = rel.split("\\").filter(Boolean);
  const base = basenames[basenames.length - 1] ?? "";
  if (!base || base !== input.confirmName.trim()) {
    return {
      ok: false,
      error: "confirm_name_mismatch",
      code: "confirm_name_mismatch",
      message: "confirmName must match the file basename exactly",
      status: 400,
    };
  }

  const abs = path.join(RELEASES_ROOT, rel);
  if (!assertInsideReleases(abs)) {
    return {
      ok: false,
      error: "path_denied",
      code: "path_denied",
      message: "Resolved path escaped H:\\releases jail",
      status: 403,
    };
  }

  try {
    await access(abs);
  } catch {
    return {
      ok: false,
      error: "not_found",
      code: "not_found",
      message: "File not found",
      status: 404,
    };
  }

  const st = await lstat(abs);
  if (st.isDirectory()) {
    return {
      ok: false,
      error: "is_directory",
      code: "is_directory",
      message: "Directory delete refused — single file only",
      status: 400,
    };
  }

  await unlink(abs);

  try {
    await appendActivityQueueRow({
      action: "filebridge.delete",
      target: rel,
      result: "deleted",
      notes: "OS_FILEBRIDGE_DELETE=1 single-file under H:\\releases",
      provider: "proddeck",
      role: "os",
      session: "proddeck-filebridge",
    });
  } catch {
    /* audit best-effort */
  }

  return { ok: true, rel, abs };
}
