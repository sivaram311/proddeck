"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { QuayOsEcho } from "../types";

/** Q3D-1 — read-only tide gauges for E/F/G/H free ratios. */
export function TideGauges({ pulse }: { pulse?: QuayOsEcho["pulse"] }) {
  const drives = pulse ?? { e: 0.5, f: 0.5, g: 0.5, h: 0.5 };
  const letters = [
    { key: "e" as const, x: -3.2 },
    { key: "f" as const, x: -1.1 },
    { key: "g" as const, x: 1.1 },
    { key: "h" as const, x: 3.2 },
  ];

  return (
    <group position={[0, 0.05, -4.5]} name="tide-gauges">
      {letters.map(({ key, x }) => {
        const free = Math.max(0, Math.min(1, drives[key] ?? 0.5));
        const high = free < 0.15;
        return (
          <group key={key} position={[x, 0, 0]}>
            <mesh position={[0, 0.6, 0]}>
              <cylinderGeometry args={[0.12, 0.14, 1.2, 8]} />
              <meshStandardMaterial color="#2a3544" roughness={0.85} />
            </mesh>
            <mesh position={[0, free * 0.5, 0]} scale={[1, free, 1]}>
              <cylinderGeometry args={[0.09, 0.09, 1.0, 8]} />
              <meshStandardMaterial
                color={high ? "#c47a2c" : "#9ad46a"}
                emissive={high ? "#c47a2c" : "#6a9a40"}
                emissiveIntensity={0.35}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/** Q3D-1 — bollard ropes from ports snapshot. */
export function PortBollards({ ports }: { ports?: QuayOsEcho["ports"] }) {
  const rows = (ports ?? []).slice(0, 8);
  return (
    <group position={[5.5, 0.05, -1]} name="port-bollards">
      {rows.map((r, i) => {
        const ok = r.state === "ok";
        const mismatch = r.state === "mismatch";
        return (
          <group key={`${r.port}-${i}`} position={[0, 0, i * 0.55 - 1.5]}>
            <mesh>
              <cylinderGeometry args={[0.1, 0.12, 0.35, 8]} />
              <meshStandardMaterial color="#4a5564" />
            </mesh>
            <mesh position={[0.25, 0.15, 0]} rotation={[0, 0, ok ? 0.2 : 0.6]}>
              <cylinderGeometry args={[0.02, 0.02, 0.55, 6]} />
              <meshStandardMaterial
                color={mismatch ? "#c45c5c" : ok ? "#8aa070" : "#6a7080"}
                emissive={mismatch ? "#802020" : "#000000"}
                emissiveIntensity={mismatch ? 0.4 : 0}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/** Q3D-3 — Fabric Ignition lane buoys (read-only). */
export function FabricBuoys({ lanes }: { lanes?: QuayOsEcho["fabricLanes"] }) {
  const group = useRef<THREE.Group>(null);
  const list = lanes ?? [];
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      child.position.y = 0.15 + Math.sin(clock.elapsedTime * 1.4 + i) * 0.04;
    });
  });

  const mats = useMemo(
    () =>
      list.map((l) => {
        const running = l.status === "running" || l.status === "queued";
        const blocked = l.status === "blocked" || l.status === "failed";
        const em = /em|lead/i.test(l.label);
        return {
          color: em ? "#7a8a9a" : running ? "#9ad46a" : blocked ? "#555" : "#6a8070",
          emissive: em ? "#304050" : running ? "#6a9a40" : "#000000",
          intensity: running && !em ? 0.55 : 0.15,
        };
      }),
    [list],
  );

  if (list.length === 0) return null;

  return (
    <group ref={group} position={[-2, 0, -7]} name="fabric-buoys">
      {list.map((l, i) => (
        <mesh key={l.id} position={[i * 0.7 - (list.length * 0.35), 0.15, 0]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial
            color={mats[i]!.color}
            emissive={mats[i]!.emissive}
            emissiveIntensity={mats[i]!.intensity}
          />
        </mesh>
      ))}
    </group>
  );
}
