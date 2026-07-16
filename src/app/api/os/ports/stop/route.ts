import { NextRequest, NextResponse } from "next/server";
import { corsPreflight, withOpenCors } from "@/lib/cors";
import { verifyProdDeckBearer } from "@/lib/jwt";
import { killPortProcesses } from "@/os/modules/ports/stopKill";

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
    ports?: number[];
    confirmPorts?: number[];
    confirmPhrase?: string;
    mode?: string;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return withOpenCors(
      NextResponse.json({ ok: false, error: "bad_json", message: "JSON body required" }, { status: 400 }),
    );
  }

  if (body.mode && body.mode !== "kill") {
    return withOpenCors(
      NextResponse.json({ ok: false, error: "bad_mode", message: "mode must be kill" }, { status: 400 }),
    );
  }

  const result = await killPortProcesses({
    ports: body.ports ?? [],
    confirmPorts: body.confirmPorts ?? [],
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

  return withOpenCors(NextResponse.json({ ok: true, ...result.result }));
}
