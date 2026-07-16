import { NextRequest, NextResponse } from "next/server";
import { corsPreflight, withOpenCors } from "@/lib/cors";
import { verifyProdDeckBearer } from "@/lib/jwt";
import { deleteReleaseFile } from "@/os/modules/filebridge/delete";
import { listReleasesPath } from "@/os/modules/filebridge/list";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DELETE_BLOCKED = {
  error: "blocked" as const,
  code: "conscious_no_delete" as const,
  message:
    "Deletes are blocked (CONSCIOUS #1). Set OS_FILEBRIDGE_DELETE=1 + EM GO + typed phrase for single-file delete under H:\\releases only.",
};

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("path");
  const result = await listReleasesPath(raw);
  if (!result.ok) {
    return withOpenCors(
      NextResponse.json(
        { ok: false, error: result.error, message: result.message },
        { status: result.status },
      ),
    );
  }
  return withOpenCors(
    NextResponse.json({
      ok: true,
      root: result.root,
      rel: result.rel,
      entries: result.entries,
    }),
  );
}

/** Hard-fail unless POST /delete path used with flag. */
export async function DELETE() {
  return withOpenCors(NextResponse.json(DELETE_BLOCKED, { status: 403 }));
}

export async function PUT() {
  return withOpenCors(NextResponse.json(DELETE_BLOCKED, { status: 403 }));
}

export async function PATCH() {
  return withOpenCors(NextResponse.json(DELETE_BLOCKED, { status: 403 }));
}

/**
 * POST — list stays GET; body.op=delete for gated single-file delete.
 */
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
    rel?: string;
    confirmName?: string;
    confirmPhrase?: string;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return withOpenCors(
      NextResponse.json({ ok: false, error: "bad_json", message: "JSON body required" }, { status: 400 }),
    );
  }

  if (body.op !== "delete") {
    return withOpenCors(NextResponse.json(DELETE_BLOCKED, { status: 403 }));
  }

  const result = await deleteReleaseFile({
    rel: body.rel ?? "",
    confirmName: body.confirmName ?? "",
    confirmPhrase: body.confirmPhrase ?? "",
  });

  if (!result.ok) {
    return withOpenCors(
      NextResponse.json(
        { ok: false, error: result.error, code: result.code, message: result.message },
        { status: result.status },
      ),
    );
  }

  return withOpenCors(NextResponse.json({ ok: true, rel: result.rel }));
}
