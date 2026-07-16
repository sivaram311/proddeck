import { NextRequest, NextResponse } from "next/server";
import { corsPreflight, withOpenCors } from "@/lib/cors";
import { spawnLiveRunners } from "@/os/modules/yard/runners";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

export async function POST(req: NextRequest) {
  let body: {
    packId?: string;
    skills?: string[];
    brief?: string;
    env?: string;
    returnUrl?: string;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return withOpenCors(
      NextResponse.json({ ok: false, error: "bad_json", message: "JSON body required" }, { status: 400 }),
    );
  }

  const result = await spawnLiveRunners({
    packId: body.packId ?? "unknown",
    skills: Array.isArray(body.skills) ? body.skills.map(String) : [],
    brief: body.brief ?? "",
    env: body.env ?? "dev",
    returnUrl: body.returnUrl ?? "https://home.delena.buzz/?osPlace=watch",
  });

  return withOpenCors(NextResponse.json({ ok: true, ...result }));
}
