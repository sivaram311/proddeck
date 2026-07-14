"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { DeckApp } from "@/lib/types";
import { WatchSilhouette } from "./Characters";
import type { CrewToken } from "./types";

function BuildingShell({
  position,
  size,
  color = "#161c24",
  roof = "#0c1016",
  children,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  roof?: string;
  children?: React.ReactNode;
}) {
  const [w, h, d] = size;
  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} roughness={0.78} metalness={0.12} />
      </mesh>
      <mesh position={[0, h + 0.15, 0]} castShadow>
        <boxGeometry args={[w + 0.3, 0.3, d + 0.3]} />
        <meshStandardMaterial color={roof} roughness={0.9} />
      </mesh>
      <mesh position={[0, h * 0.55, d / 2 + 0.02]}>
        <planeGeometry args={[w * 0.55, h * 0.28]} />
        <meshStandardMaterial
          color="#0a1218"
          emissive="#3a4a5a"
          emissiveIntensity={0.25}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>
      {children}
    </group>
  );
}

export function GateLantern({ acknowledge }: { acknowledge: boolean }) {
  const core = useRef<THREE.MeshStandardMaterial>(null);
  const ack = useRef(0);

  useEffect(() => {
    if (acknowledge) ack.current = 1;
  }, [acknowledge]);

  useFrame((_, dt) => {
    if (!core.current) return;
    if (ack.current > 0) ack.current = Math.max(0, ack.current - dt * 0.7);
    const breathe = 0.9 + Math.sin(performance.now() * 0.0014) * 0.35;
    core.current.emissiveIntensity = breathe + ack.current * 2.2;
  });

  return (
    <group position={[0, 0, 3.5]}>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.1, 2.2, 10]} />
        <meshStandardMaterial color="#3a3228" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 2.35, 0]}>
        <sphereGeometry args={[0.28, 20, 20]} />
        <meshStandardMaterial
          ref={core}
          color="#e8eef4"
          emissive="#b8f000"
          emissiveIntensity={1.1}
          transparent
          opacity={0.92}
          toneMapped={false}
        />
      </mesh>
      <pointLight position={[0, 2.3, 0]} intensity={1.2} distance={10} color="#c8f040" />
    </group>
  );
}

function BerthFace({
  app,
  x,
  y,
  attention,
  selected,
  cast,
  onPick,
}: {
  app: DeckApp;
  x: number;
  y: number;
  attention: boolean;
  selected: boolean;
  cast: boolean;
  onPick: () => void;
}) {
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    if (!mat.current) return;
    let i = 0.15 + Math.sin(performance.now() * 0.002) * 0.05;
    if (attention) i = 0.35;
    if (selected) i = 0.85;
    if (cast) i = 1.6;
    mat.current.emissiveIntensity = i;
  });
  return (
    <mesh
      position={[x, y, -1.9]}
      onClick={(e) => {
        e.stopPropagation();
        onPick();
      }}
    >
      <boxGeometry args={[0.95, 0.7, 0.08]} />
      <meshStandardMaterial
        ref={mat}
        color="#1c2430"
        emissive="#b8f000"
        emissiveIntensity={0.2}
        metalness={0.3}
        roughness={0.45}
      />
    </mesh>
  );
}

export function ManifestHall({
  apps,
  active,
  pendingSlug,
  wakeToken,
  onEnter,
  onSelectApp,
}: {
  apps: DeckApp[];
  active: boolean;
  pendingSlug: string | null;
  wakeToken: number;
  onEnter: () => void;
  onSelectApp: (app: DeckApp) => void;
}) {
  const lastWake = useRef(wakeToken);
  const casting = useRef(false);
  useFrame(() => {
    if (wakeToken !== lastWake.current) {
      lastWake.current = wakeToken;
      casting.current = true;
      window.setTimeout(() => {
        casting.current = false;
      }, 700);
    }
  });

  return (
    <BuildingShell position={[-0.2, 0, -10]} size={[5.2, 3.2, 4.5]} color="#141a22">
      <mesh
        position={[0, 0.95, 2.4]}
        onClick={(e) => {
          e.stopPropagation();
          onEnter();
        }}
      >
        <boxGeometry args={[1.1, 1.9, 0.12]} />
        <meshStandardMaterial
          color="#0e1218"
          emissive={active ? "#b8f000" : "#1a2208"}
          emissiveIntensity={active ? 0.45 : 0.12}
        />
      </mesh>
      <Html position={[0, 3.6, 0]} center distanceFactor={10} style={{ pointerEvents: "none" }}>
        <div
          style={{
            fontFamily: "var(--font-display), sans-serif",
            color: "#b8f000",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 0.04,
            textShadow: "0 0 8px rgba(0,0,0,0.8)",
            whiteSpace: "nowrap",
          }}
        >
          Manifest Hall
        </div>
      </Html>
      {apps.slice(0, 8).map((app, i) => {
        const x = -1.8 + (i % 4) * 1.2;
        const y = 1.1 + Math.floor(i / 4) * 0.9;
        return (
          <BerthFace
            key={app.slug}
            app={app}
            x={x}
            y={y}
            attention={active}
            selected={pendingSlug === app.slug}
            cast={casting.current && pendingSlug === app.slug}
            onPick={() => {
              onEnter();
              onSelectApp(app);
            }}
          />
        );
      })}
    </BuildingShell>
  );
}

export function MemoryShed({
  active,
  ticketToken,
  onEnter,
}: {
  active: boolean;
  ticketToken: number;
  onEnter: () => void;
}) {
  const peg = useRef<THREE.Group>(null);
  const ticket = useRef<THREE.Mesh>(null);
  const last = useRef(ticketToken);
  const nailT = useRef(0);

  useFrame((_, dt) => {
    if (ticketToken !== last.current) {
      last.current = ticketToken;
      nailT.current = 0.001;
    }
    if (nailT.current > 0 && ticket.current) {
      nailT.current += dt;
      const u = Math.min(1, nailT.current / 0.55);
      ticket.current.position.set(0.2, 1.2 - u * 0.55, 0.15);
      ticket.current.visible = true;
      const m = ticket.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 0.3 + (1 - u) * 0.8;
      if (u >= 1) nailT.current = 0;
    }
  });

  return (
    <BuildingShell position={[4.2, 0, -18]} size={[3.2, 2.4, 3]} color="#1a1612" roof="#12100e">
      <mesh position={[-1.55, 0.7, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.4, 1]} />
        <meshStandardMaterial color="#2a1c10" emissive="#c48a3a" emissiveIntensity={active ? 0.55 : 0.35} />
      </mesh>
      <pointLight position={[-0.5, 1.4, 0]} intensity={0.55} distance={5} color="#e0a050" />
      <mesh
        position={[0, 0.85, 1.55]}
        onClick={(e) => {
          e.stopPropagation();
          onEnter();
        }}
      >
        <boxGeometry args={[0.9, 1.6, 0.1]} />
        <meshStandardMaterial
          color="#120e0c"
          emissive={active ? "#c48a3a" : "#2a1810"}
          emissiveIntensity={active ? 0.4 : 0.1}
        />
      </mesh>
      <Html position={[0, 2.8, 0]} center distanceFactor={10} style={{ pointerEvents: "none" }}>
        <div
          style={{
            fontFamily: "var(--font-display), sans-serif",
            color: "#e0a050",
            fontSize: 13,
            fontWeight: 700,
            whiteSpace: "nowrap",
            textShadow: "0 0 8px rgba(0,0,0,0.8)",
          }}
        >
          Memory Shed
        </div>
      </Html>
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[1.4, 0.12, 0.7]} />
        <meshStandardMaterial color="#3a2a1c" roughness={0.85} />
      </mesh>
      {/* Ticket peg board */}
      <group ref={peg} position={[0.55, 1.1, -0.9]}>
        <mesh>
          <boxGeometry args={[0.7, 1.1, 0.06]} />
          <meshStandardMaterial color="#2a1e14" />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[-0.15 + (i % 2) * 0.25, 0.3 - Math.floor(i / 2) * 0.35, 0.06]}>
            <cylinderGeometry args={[0.03, 0.03, 0.08, 8]} />
            <meshStandardMaterial color="#8a7a60" metalness={0.5} />
          </mesh>
        ))}
        <mesh ref={ticket} position={[0.2, 1.2, 0.15]} visible={false}>
          <boxGeometry args={[0.22, 0.28, 0.02]} />
          <meshStandardMaterial color="#e8eef4" emissive="#c48a3a" emissiveIntensity={0.4} />
        </mesh>
      </group>
    </BuildingShell>
  );
}

export function WatchLoft({
  crews,
  active,
  loftAck,
  onEnter,
}: {
  crews: CrewToken[];
  active: boolean;
  loftAck: boolean;
  onEnter: () => void;
}) {
  const chart = useRef<THREE.MeshStandardMaterial>(null);
  const ack = useRef(0);
  useEffect(() => {
    if (loftAck) ack.current = 1;
  }, [loftAck]);
  useFrame((_, dt) => {
    if (!chart.current) return;
    if (ack.current > 0) ack.current = Math.max(0, ack.current - dt * 1.2);
    chart.current.emissiveIntensity = 0.15 + ack.current * 1.1;
  });

  return (
    <group position={[-3.8, 0, -26]}>
      {[-1.2, 1.2].map((x) =>
        [-1, 1].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.7, z]} castShadow>
            <cylinderGeometry args={[0.1, 0.12, 1.4, 8]} />
            <meshStandardMaterial color="#2a2218" />
          </mesh>
        )),
      )}
      <BuildingShell position={[0, 1.4, 0]} size={[3.6, 2.2, 3.2]} color="#121820">
        <mesh
          position={[1.85, 0.7, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onEnter();
          }}
        >
          <boxGeometry args={[0.9, 1.5, 0.1]} />
          <meshStandardMaterial
            color="#0a1016"
            emissive={active ? "#6a9aaa" : "#1a2830"}
            emissiveIntensity={active ? 0.5 : 0.15}
          />
        </mesh>
        <Html position={[0, 2.7, 0]} center distanceFactor={10} style={{ pointerEvents: "none" }}>
          <div
            style={{
              fontFamily: "var(--font-display), sans-serif",
              color: "#8bb8c8",
              fontSize: 13,
              fontWeight: 700,
              whiteSpace: "nowrap",
              textShadow: "0 0 8px rgba(0,0,0,0.8)",
            }}
          >
            Watch Loft
          </div>
        </Html>
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[1.6, 0.1, 1]} />
          <meshStandardMaterial
            ref={chart}
            color="#1e2830"
            emissive="#b8f000"
            emissiveIntensity={0.15}
            metalness={0.2}
            roughness={0.6}
          />
        </mesh>
        {crews.slice(0, 4).map((c, i) => (
          <WatchSilhouette
            key={c.id}
            position={[-1.1 + i * 0.7, 0.55, -0.9]}
            acknowledge={loftAck}
            delay={i * 0.07}
            label={c.label}
          />
        ))}
      </BuildingShell>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[2.1, 0.2 + i * 0.32, 1.2 - i * 0.35]} castShadow>
          <boxGeometry args={[0.7, 0.1, 0.4]} />
          <meshStandardMaterial color="#2a241c" />
        </mesh>
      ))}
    </group>
  );
}
