import { NextResponse } from "next/server";
import { withOpenCors } from "@/lib/cors";
import { loadProdDeckPack, toPackPublic } from "@/lib/pack";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const pack = await loadProdDeckPack();
    return withOpenCors(NextResponse.json(toPackPublic(pack)));
  } catch (err) {
    const message = err instanceof Error ? err.message : "pack load failed";
    return withOpenCors(
      NextResponse.json({ error: "pack_invalid", message }, { status: 500 }),
    );
  }
}
