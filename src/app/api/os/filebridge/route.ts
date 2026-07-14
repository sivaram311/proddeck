import { NextRequest, NextResponse } from "next/server";
import { corsPreflight, withOpenCors } from "@/lib/cors";
import { listReleasesPath } from "@/os/modules/filebridge/list";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DELETE_BLOCKED = {
  error: "blocked" as const,
  code: "conscious_no_delete" as const,
  message:
    "Deletes are blocked (CONSCIOUS #1). ProdDeck FileBridge never performs H: delete IO. Use Open H-Drive / FileBridge app only after explicit user confirmation of the exact target.",
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

/** Hard-fail — no H: delete IO (CONSCIOUS). */
export async function DELETE() {
  return withOpenCors(NextResponse.json(DELETE_BLOCKED, { status: 403 }));
}

/** Hard-fail mutations — list API is read-only. */
export async function POST() {
  return withOpenCors(NextResponse.json(DELETE_BLOCKED, { status: 403 }));
}

export async function PUT() {
  return withOpenCors(NextResponse.json(DELETE_BLOCKED, { status: 403 }));
}

export async function PATCH() {
  return withOpenCors(NextResponse.json(DELETE_BLOCKED, { status: 403 }));
}
