import { NextRequest, NextResponse } from "next/server";
import { withOpenCors } from "@/lib/cors";
import { verifyProdDeckBearer } from "@/lib/jwt";
import { loadProdDeckPack } from "@/lib/pack";
import { createTicket, listTickets } from "@/helpdesk/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const gate = await verifyProdDeckBearer(req.headers.get("authorization"));
  if (!gate.ok) {
    return withOpenCors(
      NextResponse.json(
        { error: "unauthorized", code: gate.code, message: gate.message },
        { status: gate.status },
      ),
    );
  }
  const pack = await loadProdDeckPack();
  if (!pack.modules.helpdesk) {
    return withOpenCors(
      NextResponse.json({ error: "disabled", code: "MODULE_OFF", message: "Helpdesk module off" }, { status: 404 }),
    );
  }
  return withOpenCors(NextResponse.json({ tickets: listTickets() }));
}

export async function POST(req: NextRequest) {
  const gate = await verifyProdDeckBearer(req.headers.get("authorization"));
  if (!gate.ok) {
    return withOpenCors(
      NextResponse.json(
        { error: "unauthorized", code: gate.code, message: gate.message },
        { status: gate.status },
      ),
    );
  }
  const pack = await loadProdDeckPack();
  if (!pack.modules.helpdesk) {
    return withOpenCors(
      NextResponse.json({ error: "disabled", code: "MODULE_OFF", message: "Helpdesk module off" }, { status: 404 }),
    );
  }

  let body: { title?: string; category?: string; body?: string };
  try {
    body = (await req.json()) as { title?: string; category?: string; body?: string };
  } catch {
    return withOpenCors(
      NextResponse.json({ error: "invalid_json", code: "VALIDATION", message: "JSON body required" }, { status: 400 }),
    );
  }

  const result = createTicket({
    title: body.title || "",
    category: body.category || "",
    body: body.body,
    createdBy: gate.sub || "unknown",
    pack,
  });

  if ("error" in result) {
    return withOpenCors(
      NextResponse.json({ error: result.error, code: result.code, message: result.error }, { status: 400 }),
    );
  }

  return withOpenCors(NextResponse.json({ ticket: result }, { status: 201 }));
}
