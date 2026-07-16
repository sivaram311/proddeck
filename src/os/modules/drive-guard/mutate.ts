import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { OS_FLAGS } from "@/os/flags";
import type { OsEnv } from "@/os/types";
import { expectedConfirmPhrase, isDestructiveEnv } from "./confirm";

export type DriveGuardMutateOp = "write_pin_file" | "touch_promote_marker";

const ALLOWED_ROOTS = [
  path.resolve("H:\\releases"),
  path.resolve(process.cwd(), ".data", "drive-guard-sandbox"),
];

function insideAllowlist(abs: string): boolean {
  const resolved = path.resolve(abs).toLowerCase();
  return ALLOWED_ROOTS.some((root) => {
    const r = root.toLowerCase();
    return resolved === r || resolved.startsWith(`${r}\\`);
  });
}

export type MutateResult =
  | { ok: true; op: DriveGuardMutateOp; path: string }
  | { ok: false; error: string; code?: string; message: string; status: number };

/**
 * Narrow allowlisted mutations only. Flag OFF → 403.
 * Never partition / mass delete / nginx / postgres.
 */
export async function assertMutationAllowed(
  op: string,
  env: OsEnv,
  paths: string[],
  typedConfirm: string,
  cssFresh: boolean,
): Promise<MutateResult | null> {
  if (!OS_FLAGS.driveGuardMutate()) {
    return {
      ok: false,
      error: "blocked",
      code: "flag_off",
      message: "OS_DRIVE_GUARD_MUTATE=0 (default). No disk IO.",
      status: 403,
    };
  }

  if (op !== "write_pin_file" && op !== "touch_promote_marker") {
    return {
      ok: false,
      error: "unknown_op",
      code: "unknown_op",
      message: `Unknown op: ${op}`,
      status: 400,
    };
  }

  if (isDestructiveEnv(env)) {
    if (!cssFresh) {
      return {
        ok: false,
        error: "css_stale",
        code: "css_stale",
        message: "CSS session must be fresh for PROD/RELEASES mutations",
        status: 401,
      };
    }
    const expect = expectedConfirmPhrase(env);
    if (typedConfirm.trim() !== expect) {
      return {
        ok: false,
        error: "confirm_required",
        code: "confirm_required",
        message: `Type ${expect} to confirm under ${env.toUpperCase()}`,
        status: 403,
      };
    }
  }

  for (const p of paths) {
    if (!insideAllowlist(p)) {
      return {
        ok: false,
        error: "path_denied",
        code: "path_denied",
        message: `Path outside allowlist: ${p}`,
        status: 403,
      };
    }
  }

  return null;
}

export async function runDriveGuardMutate(input: {
  op: DriveGuardMutateOp;
  env: OsEnv;
  relPath: string;
  content?: string;
  typedConfirm: string;
  cssFresh: boolean;
}): Promise<MutateResult> {
  const target =
    input.op === "write_pin_file"
      ? path.resolve(process.cwd(), ".data", "drive-guard-sandbox", path.basename(input.relPath))
      : path.resolve("H:\\releases", input.relPath.replace(/^[/\\]+/, ""));

  const gate = await assertMutationAllowed(
    input.op,
    input.env,
    [target],
    input.typedConfirm,
    input.cssFresh,
  );
  if (gate) return gate;

  await mkdir(path.dirname(target), { recursive: true });
  const body =
    input.content ??
    JSON.stringify(
      {
        at: new Date().toISOString(),
        op: input.op,
        env: input.env,
        source: "proddeck-drive-guard",
      },
      null,
      2,
    );
  await writeFile(target, body, "utf8");
  return { ok: true, op: input.op, path: target };
}
