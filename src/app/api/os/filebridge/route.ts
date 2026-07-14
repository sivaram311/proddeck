import { readdir } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { withOpenCors } from "@/lib/cors";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ROOT = "H:\\";

export async function GET(req: NextRequest) {
  const rel = (req.nextUrl.searchParams.get("path") || "releases").replace(/\.\./g, "");
  const abs = path.join(ROOT, rel);
  if (!abs.toLowerCase().startsWith("h:\\")) {
    return withOpenCors(NextResponse.json({ error: "path_denied" }, { status: 403 }));
  }
  try {
    const names = await readdir(abs, { withFileTypes: true });
    const entries = names.slice(0, 100).map((d) => ({
      name: d.name,
      path: path.join(abs, d.name),
      kind: d.isDirectory() ? "dir" : "file",
    }));
    return withOpenCors(NextResponse.json({ root: abs, entries }));
  } catch (err) {
    const message = err instanceof Error ? err.message : "readdir failed";
    return withOpenCors(NextResponse.json({ error: "list_failed", message }, { status: 500 }));
  }
}
