import { readFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { withOpenCors } from "@/lib/cors";
import { verifyProdDeckBearer } from "@/lib/jwt";
import type { CatalogResponse, DeckApp } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RegistryFile = { apps: DeckApp[] };

function normalizeApp(raw: Record<string, unknown>): DeckApp | null {
  const slug = String(raw.slug ?? raw.id ?? raw.appId ?? "").trim();
  const baseUrl = String(raw.baseUrl ?? raw.url ?? raw.prodUrl ?? "").trim();
  if (!slug || !baseUrl) return null;
  const enabled = raw.enabled;
  if (enabled === false) return null;
  const env = String(raw.env ?? "prod").toLowerCase();
  const preferProd = env === "prod" || Boolean(raw.prodUrl) || baseUrl.startsWith("https://");
  if (!preferProd && env !== "prod") return null;
  return {
    slug,
    name: String(raw.name ?? slug),
    description: String(raw.description ?? ""),
    baseUrl: baseUrl.replace(/\/$/, ""),
    clientId: String(raw.clientId ?? slug),
    env: env === "prod" ? "prod" : env,
  };
}

function mergeBySlug(staticApps: DeckApp[], platformApps: DeckApp[]): DeckApp[] {
  const map = new Map<string, DeckApp>();
  for (const app of staticApps) map.set(app.slug, app);
  for (const app of platformApps) {
    const prev = map.get(app.slug);
    map.set(app.slug, prev ? { ...prev, ...app, baseUrl: app.baseUrl || prev.baseUrl } : app);
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

async function loadStaticRegistry(): Promise<DeckApp[]> {
  const file = path.join(process.cwd(), "data", "apps.registry.json");
  const raw = await readFile(file, "utf8");
  const parsed = JSON.parse(raw) as RegistryFile;
  return (parsed.apps || []).map((a) => normalizeApp(a as unknown as Record<string, unknown>)).filter(Boolean) as DeckApp[];
}

async function fetchPlatformApps(): Promise<DeckApp[]> {
  const url = (process.env.PLATFORM_APPS_URL || "").trim();
  if (!url) return [];
  try {
    const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(4000) });
    if (!res.ok) return [];
    const data = (await res.json()) as unknown;
    const list = Array.isArray(data)
      ? data
      : Array.isArray((data as { apps?: unknown }).apps)
        ? (data as { apps: unknown[] }).apps
        : [];
    return list
      .map((item) => normalizeApp(item as Record<string, unknown>))
      .filter(Boolean) as DeckApp[];
  } catch {
    return [];
  }
}

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

  const staticApps = await loadStaticRegistry();
  const platformApps = await fetchPlatformApps();
  const apps = mergeBySlug(staticApps, platformApps);
  const body: CatalogResponse = {
    apps,
    source: platformApps.length > 0 ? "merged" : "static",
  };
  return withOpenCors(NextResponse.json(body));
}
