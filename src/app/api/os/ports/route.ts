import { NextRequest, NextResponse } from "next/server";
import { withOpenCors } from "@/lib/cors";
import { verifyProdDeckBearer } from "@/lib/jwt";
import { loadPortRegistry } from "@/os/modules/ports/registry";
import { scanListeningPorts } from "@/os/modules/ports/listeners";
import type { PortMismatch, PortRow, PortsResponse } from "@/os/modules/ports/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function mismatchFor(status: string, listening: boolean): PortMismatch {
  if (listening) return "none";
  if (status === "active" || status === "reserved") return "not-listening";
  return "none";
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

  try {
    const [registry, listeners] = await Promise.all([
      loadPortRegistry(),
      scanListeningPorts(),
    ]);

    const reservedSet = new Set(registry.entries.map((e) => e.port));

    const reserved: PortRow[] = registry.entries.map((entry) => {
      const listening = listeners.ports.has(entry.port);
      return {
        ...entry,
        listening,
        mismatch: mismatchFor(String(entry.status), listening),
      };
    });

    const unknownListeners = Array.from(listeners.ports)
      .filter((port) => !reservedSet.has(port))
      .sort((a, b) => a - b);

    const body: PortsResponse = {
      at: new Date().toISOString(),
      source: registry.source,
      registryUpdated: registry.updated,
      ranges: registry.ranges as PortsResponse["ranges"],
      reserved,
      unknownListeners,
      listenerScan: listeners.scan,
      listenerNote: listeners.note,
    };

    return withOpenCors(NextResponse.json(body));
  } catch (err) {
    const message = err instanceof Error ? err.message : "ports collect failed";
    return withOpenCors(
      NextResponse.json({ error: "ports_failed", message }, { status: 500 }),
    );
  }
}
