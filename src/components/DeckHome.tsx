"use client";

import { useCallback, useEffect, useState } from "react";
import { AUTH_CONFIG } from "@/lib/config";
import { ensureFreshToken } from "@/lib/auth";
import type { DeckApp } from "@/lib/types";
import { AppTile } from "@/components/AppTile";
import { HelpdeskPanel } from "@/components/HelpdeskPanel";
import { KeepersQuayScene } from "@/scene/keepers-quay/KeepersQuayScene";
import type { KeeperAction } from "@/scene/keepers-quay/Characters";
import type { QuayPlace } from "@/scene/keepers-quay/types";
import { DriveGuardChip } from "@/os/shell/DriveGuardChip";
import { PlacePanel } from "@/os/shell/PlacePanel";
import { PlacesNav } from "@/os/shell/PlacesNav";
import type { OsEnv, OsModuleFlags, OsPlaceId } from "@/os/types";

type Props = {
  username?: string;
  onLogout: () => void;
};

type PackPublic = {
  modules: { catalog: boolean; helpdesk: boolean; scene: boolean; crewsDesk: boolean };
  scene: { pack: string; defaultView: "catalog" | "helpdesk" | "scene" };
  helpdesk: { categories: { id: string; label: string; crewRole: string }[] };
  crews?: { id: string; label: string; watch: string }[];
  version: string;
  os?: {
    enabled: boolean;
    defaultPlace: OsPlaceId;
    modules: OsModuleFlags;
  };
};

type Panel = "none" | "catalog" | "helpdesk" | "crews";

export function DeckHome({ username, onLogout }: Props) {
  const [apps, setApps] = useState<DeckApp[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pack, setPack] = useState<PackPublic | null>(null);
  const [place, setPlace] = useState<QuayPlace>("pier");
  const [panel, setPanel] = useState<Panel>("none");
  const [wakeToken, setWakeToken] = useState(0);
  const [webglFailed, setWebglFailed] = useState(false);
  const [pendingLaunch, setPendingLaunch] = useState<DeckApp | null>(null);
  const [flatMode, setFlatMode] = useState(false);
  const [ticketToken, setTicketToken] = useState(0);
  const [keeperAction, setKeeperAction] = useState<KeeperAction>("idle");
  const [actionToken, setActionToken] = useState(0);
  const [loftAck, setLoftAck] = useState(false);
  const [gateAck, setGateAck] = useState(false);
  const [osPlace, setOsPlace] = useState<OsPlaceId>("quay");
  const [osEnv, setOsEnv] = useState<OsEnv>("dev");

  const osEnabled = pack?.os?.enabled !== false;
  const osFlags: OsModuleFlags = pack?.os?.modules ?? {
    pulse: true,
    ports: true,
    beacon: true,
    identity: true,
    "activity-log": true,
    archive: true,
    dispatch: true,
    promote: true,
    yard: true,
    runbooks: true,
    appliances: true,
    "drive-guard": true,
    filebridge: true,
    "watch-ops": true,
  };
  const showQuayUi = !osEnabled || osPlace === "quay";

  useEffect(() => {
    setGateAck(true);
    const t = window.setTimeout(() => setGateAck(false), 1600);
    return () => window.clearTimeout(t);
  }, []);

  function fireAction(a: KeeperAction) {
    setKeeperAction(a);
    setActionToken((n) => n + 1);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/pack", { cache: "no-store" });
        if (!res.ok) throw new Error("Pack load failed");
        const data = (await res.json()) as PackPublic;
        if (cancelled) return;
        setPack(data);
        if (data.os?.defaultPlace) setOsPlace(data.os.defaultPlace);
        if (data.scene.defaultView === "catalog" || !data.modules.scene) {
          setFlatMode(true);
          setPanel("catalog");
        } else {
          setFlatMode(false);
          setPanel("none");
        }
      } catch {
        if (!cancelled) setPack(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await ensureFreshToken(AUTH_CONFIG);
        if (!token) throw new Error("Session expired");
        const res = await fetch("/api/catalog", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as { message?: string } | null;
          throw new Error(body?.message || `Catalog failed (${res.status})`);
        }
        const data = (await res.json()) as { apps: DeckApp[] };
        if (!cancelled) setApps(data.apps || []);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load catalog");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const useQuay =
    showQuayUi &&
    Boolean(pack?.modules.scene) &&
    pack?.scene.pack === "keepers-quay" &&
    !flatMode &&
    !webglFailed;

  function onOsPlace(id: OsPlaceId) {
    setOsPlace(id);
    if (id !== "quay") {
      setPanel("none");
      setPendingLaunch(null);
    }
  }

  const onWebglFail = useCallback(() => {
    setWebglFailed(true);
    setFlatMode(true);
    setPanel("catalog");
  }, []);

  function onPlace(p: QuayPlace) {
    setPlace(p);
    if (p === "manifest") {
      setPanel("catalog");
      fireAction("enter");
      setLoftAck(false);
    } else if (p === "shed") {
      setPanel("helpdesk");
      fireAction("enter");
      setLoftAck(false);
    } else if (p === "loft") {
      setPanel("crews");
      fireAction("scan");
      setLoftAck(true);
      window.setTimeout(() => setLoftAck(false), 1400);
    } else {
      setPanel("none");
      setLoftAck(false);
    }
  }

  function launchApp(app: DeckApp) {
    fireAction("call");
    setWakeToken((n) => n + 1);
    setPendingLaunch(null);
    window.open(app.baseUrl, "_blank", "noopener,noreferrer");
  }

  function onSelectApp(app: DeckApp) {
    setPlace("manifest");
    setPanel("catalog");
    setPendingLaunch(app);
  }

  function onTicketCreated() {
    fireAction("nail");
    setTicketToken((n) => n + 1);
  }

  const crews = pack?.crews || [];

  return (
    <div className="relative min-h-dvh w-full overflow-hidden">
      {useQuay ? (
        <KeepersQuayScene
          apps={apps}
          crews={crews}
          place={place}
          onPlace={onPlace}
          onSelectApp={onSelectApp}
          wakeToken={wakeToken}
          webglFailed={webglFailed}
          onWebglFail={onWebglFail}
          pendingSlug={pendingLaunch?.slug ?? null}
          ticketToken={ticketToken}
          keeperAction={keeperAction}
          actionToken={actionToken}
          loftAck={loftAck}
          gateAck={gateAck}
        />
      ) : null}

      <div
        className={`relative z-10 mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-4 py-6 ${
          useQuay ? "pointer-events-none" : ""
        }`}
      >
        <header className="pd-rise pointer-events-auto flex items-start justify-between gap-3">
          <div>
            <h1
              className="m-0 text-[2.5rem] leading-none tracking-tight sm:text-5xl"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                textShadow: useQuay ? "0 2px 18px rgba(0,0,0,0.85)" : undefined,
              }}
            >
              ProdDeck
            </h1>
            <p
              className="mt-3 max-w-[22rem] text-[0.95rem] leading-snug text-[var(--pd-mist)]"
              style={{ textShadow: useQuay ? "0 1px 10px rgba(0,0,0,0.9)" : undefined }}
            >
              {osEnabled && !showQuayUi
                ? "Cloud OS — Places beyond the Quay"
                : useQuay
                  ? "Keepers' Quay — call production from the Manifest"
                  : "Your production apps, one tap away"}
              {username ? ` — ${username}` : ""}
              {pack?.version ? ` · v${pack.version}` : ""}.
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            {osEnabled ? <DriveGuardChip env={osEnv} onChange={setOsEnv} /> : null}
            <button
              type="button"
              onClick={onLogout}
              className="min-h-11 rounded-md border border-[var(--pd-danger)]/40 bg-black/40 px-3 text-sm text-[var(--pd-danger)] backdrop-blur-sm"
            >
              Log out
            </button>
          </div>
        </header>

        {osEnabled ? (
          <div className="pointer-events-auto mt-5">
            <PlacesNav active={osPlace} onSelect={onOsPlace} />
          </div>
        ) : null}

        {showQuayUi ? (
          <nav
            className="pointer-events-auto mt-3 flex flex-wrap gap-2"
            aria-label="ProdDeck Quay modules"
          >
            {useQuay ? (
              <>
                <NavBtn active={place === "pier" && panel === "none"} onClick={() => onPlace("pier")}>
                  Pier
                </NavBtn>
                <NavBtn active={place === "manifest"} onClick={() => onPlace("manifest")}>
                  Manifest
                </NavBtn>
                {pack?.modules.helpdesk ? (
                  <NavBtn active={place === "shed"} onClick={() => onPlace("shed")}>
                    Memory Shed
                  </NavBtn>
                ) : null}
                {pack?.modules.crewsDesk ? (
                  <NavBtn active={place === "loft"} onClick={() => onPlace("loft")}>
                    Watch Loft
                  </NavBtn>
                ) : null}
                <NavBtn
                  active={false}
                  onClick={() => {
                    setFlatMode(true);
                    setPanel("catalog");
                  }}
                >
                  Flat catalog
                </NavBtn>
              </>
            ) : (
              <>
                <NavBtn active={panel === "catalog"} onClick={() => setPanel("catalog")}>
                  Catalog
                </NavBtn>
                {pack?.modules.helpdesk ? (
                  <NavBtn active={panel === "helpdesk"} onClick={() => setPanel("helpdesk")}>
                    Helpdesk
                  </NavBtn>
                ) : null}
                {pack?.modules.scene ? (
                  <NavBtn
                    active={false}
                    onClick={() => {
                      setWebglFailed(false);
                      setFlatMode(false);
                      setPanel("none");
                      setPlace("pier");
                    }}
                  >
                    Enter Quay
                  </NavBtn>
                ) : null}
              </>
            )}
          </nav>
        ) : null}

        {osEnabled && !showQuayUi ? <PlacePanel place={osPlace} flags={osFlags} /> : null}

        {useQuay && place === "pier" && panel === "none" ? (
          <div className="pointer-events-auto mt-8 max-w-md rounded-lg border border-white/10 bg-black/55 p-4 backdrop-blur-md">
            <p className="m-0 text-sm text-[var(--pd-paper)]" style={{ fontFamily: "var(--font-display)" }}>
              Gate Lantern
            </p>
            <p className="mt-2 m-0 text-sm text-[var(--pd-mist)]">
              Tap the pier studs to walk. Enter Manifest Hall to call production apps.
            </p>
            <button
              type="button"
              className="mt-4 min-h-11 rounded-md bg-[var(--pd-lime)] px-4 font-semibold text-[var(--pd-ink)]"
              onClick={() => onPlace("manifest")}
            >
              Enter Manifest
            </button>
          </div>
        ) : null}

        {showQuayUi &&
        (panel === "catalog" || (!useQuay && pack?.modules.catalog !== false)) &&
        (panel === "catalog" || flatMode) ? (
          <section
            className={`pointer-events-auto mt-6 flex-1 ${
              useQuay
                ? "max-h-[55vh] overflow-y-auto rounded-lg border border-white/10 bg-black/60 p-4 backdrop-blur-md"
                : ""
            }`}
            aria-label="Production apps"
          >
            {useQuay ? (
              <p className="mb-3 mt-0 text-sm text-[var(--pd-lime)]" style={{ fontFamily: "var(--font-display)" }}>
                Manifest Hall — berths
              </p>
            ) : null}
            {loading ? (
              <p className="text-[var(--pd-mist)]">Loading catalog…</p>
            ) : error ? (
              <p className="text-[var(--pd-danger)]" role="alert">
                {error}
              </p>
            ) : (
              <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
                {apps.map((app, i) => (
                  <li key={app.slug}>
                    <AppTile app={app} index={i} onPick={setPendingLaunch} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : null}

        {showQuayUi && panel === "helpdesk" && pack ? (
          <div
            className={`pointer-events-auto mt-6 flex-1 ${
              useQuay
                ? "max-h-[55vh] overflow-y-auto rounded-lg border border-white/10 bg-black/60 p-4 backdrop-blur-md"
                : ""
            }`}
          >
            {useQuay ? (
              <p className="mb-3 mt-0 text-sm text-[#e0a050]" style={{ fontFamily: "var(--font-display)" }}>
                Memory Shed
              </p>
            ) : null}
            <HelpdeskPanel categories={pack.helpdesk.categories} onTicketCreated={onTicketCreated} />
          </div>
        ) : null}

        {showQuayUi && panel === "crews" && pack?.modules.crewsDesk ? (
          <section
            className={`pointer-events-auto mt-6 ${
              useQuay
                ? "max-h-[55vh] overflow-y-auto rounded-lg border border-white/10 bg-black/60 p-4 backdrop-blur-md"
                : ""
            }`}
            aria-label="Watch Loft crews"
          >
            <p className="mb-3 mt-0 text-sm text-[#8bb8c8]" style={{ fontFamily: "var(--font-display)" }}>
              Watch Loft — on duty
            </p>
            <ul className="m-0 list-none space-y-2 p-0">
              {crews.map((c) => (
                <li
                  key={c.id}
                  className="rounded-md border border-white/10 bg-[var(--pd-steel)]/80 px-3 py-3"
                >
                  <p className="m-0 font-medium text-[var(--pd-paper)]">{c.label}</p>
                  <p className="mt-1 m-0 text-xs text-[var(--pd-mist)]">{c.watch}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      {pendingLaunch ? (
        <div className="pointer-events-auto fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-lg border border-[var(--pd-lime)]/40 bg-[var(--pd-ink)] p-5 shadow-xl">
            <p className="m-0 text-lg text-[var(--pd-paper)]" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
              Call {pendingLaunch.name}?
            </p>
            <p className="mt-2 m-0 text-sm text-[var(--pd-mist)]">
              Answering Wake will signal the far shore. Opens {pendingLaunch.baseUrl}
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="min-h-11 flex-1 rounded-md bg-[var(--pd-lime)] font-semibold text-[var(--pd-ink)]"
                onClick={() => launchApp(pendingLaunch)}
              >
                Launch
              </button>
              <button
                type="button"
                className="min-h-11 flex-1 rounded-md border border-white/20 text-[var(--pd-mist)]"
                onClick={() => setPendingLaunch(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NavBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 rounded-md px-3 text-sm backdrop-blur-sm ${
        active
          ? "bg-[var(--pd-lime)] font-semibold text-[var(--pd-ink)]"
          : "border border-white/15 bg-black/35 text-[var(--pd-mist)]"
      }`}
    >
      {children}
    </button>
  );
}
