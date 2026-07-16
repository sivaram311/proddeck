import { NextRequest, NextResponse } from "next/server";
import { corsPreflight, withOpenCors } from "@/lib/cors";
import { verifyProdDeckBearer } from "@/lib/jwt";
import {
  runDriveGuardMutate,
  type DriveGuardMutateOp,
} from "@/os/modules/drive-guard/mutate";
import type { OsEnv } from "@/os/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

export async function POST(req: NextRequest) {
  const gate = await verifyProdDeckBearer(req.headers.get("authorization"));
  if (!gate.ok) {
    return withOpenCors(
      NextResponse.json(
        { ok: false, error: gate.code ?? "unauthorized", message: gate.message },
        { status: gate.status },
      ),
    );
  }

  let body: {
    op?: string;
    env?: string;
    relPath?: string;
    content?: string;
    typedConfirm?: string;
    cssFresh?: boolean;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return withOpenCors(
      NextResponse.json({ ok: false, error: "bad_json", message: "JSON body required" }, { status: 400 }),
    );
  }

  const op = body.op as DriveGuardMutateOp;
  const env = (body.env ?? "dev") as OsEnv;
  const result = await runDriveGuardMutate({
    op,
    env,
    relPath: body.relPath ?? "pin.json",
    content: body.content,
    typedConfirm: body.typedConfirm ?? "",
    cssFresh: Boolean(body.cssFresh),
  });

  if (!result.ok) {
    return withOpenCors(
      NextResponse.json(
        { ok: false, error: result.error, code: result.code, message: result.message },
        { status: result.status },
      ),
    );
  }

  return withOpenCors(NextResponse.json({ ok: true, op: result.op, path: result.path }));
}
