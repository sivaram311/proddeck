"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { DeckApp } from "@/lib/types";
import type { CrewToken, QuayPlace } from "./types";

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
      {/* Windows */}
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

export function GateLantern({ breathe = true }: { breathe?: boolean }) {
  const core = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (!breathe || !core.current) return;
    core.current.emissiveIntensity = 0.9 + Math.sin(clock.elapsedTime * 1.4) * 0.35;
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

export function ManifestHall({
  apps,
  active,
  onEnter,
  onSelectApp,
}: {
  apps: DeckApp[];
  active: boolean;
  onEnter: () => void;
  onSelectApp: (app: DeckApp) => void;
}) {
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
      {/* Berths along inner wall (visible when near / always for realism) */}
      {apps.slice(0, 8).map((app, i) => {
        const x = -1.8 + (i % 4) * 1.2;
        const y = 1.1 + Math.floor(i / 4) * 0.9;
        return (
          <mesh
            key={app.slug}
            position={[x, y, -1.9]}
            onClick={(e) => {
              e.stopPropagation();
              onEnter();
              onSelectApp(app);
            }}
          >
            <boxGeometry args={[0.95, 0.7, 0.08]} />
            <meshStandardMaterial
              color="#1c2430"
              emissive="#b8f000"
              emissiveIntensity={0.2}
              metalness={0.3}
              roughness={0.45}
            />
          </mesh>
        );
      })}
    </BuildingShell>
  );
}

export function MemoryShed({ active, onEnter }: { active: boolean; onEnter: () => void }) {
  return (
    <BuildingShell position={[4.2, 0, -18]} size={[3.2, 2.4, 3]} color="#1a1612" roof="#12100e">
      <mesh position={[-1.55, 0.7, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.4, 1]} />
        <meshStandardMaterial color="#2a1c10" emissive="#c48a3a" emissiveIntensity={0.35} />
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
      {/* Desk */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[1.4, 0.12, 0.7]} />
        <meshStandardMaterial color="#3a2a1c" roughness={0.85} />
      </mesh>
    </BuildingShell>
  );
}

export function WatchLoft({
  crews,
  active,
  onEnter,
}: {
  crews: CrewToken[];
  active: boolean;
  onEnter: () => void;
}) {
  return (
    <group position={[-3.8, 0, -26]}>
      {/* stilts */}
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
        {/* Chart table */}
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[1.6, 0.1, 1]} />
          <meshStandardMaterial color="#1e2830" metalness={0.2} roughness={0.6} />
        </mesh>
        {/* Silhouette crew tokens */}
        {crews.slice(0, 4).map((c, i) => (
          <mesh key={c.id} position={[-1.1 + i * 0.7, 0.95, -0.9]}>
            <capsuleGeometry args={[0.12, 0.35, 4, 8]} />
            <meshStandardMaterial color="#0a0e12" emissive="#4a6070" emissiveIntensity={0.35} />
          </mesh>
        ))}
      </BuildingShell>
      {/* stair */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[2.1, 0.2 + i * 0.32, 1.2 - i * 0.35]} castShadow>
          <boxGeometry args={[0.7, 0.1, 0.4]} />
          <meshStandardMaterial color="#2a241c" />
        </mesh>
      ))}
    </group>
  );
}

export function KeeperPlayer({
  target,
  playerRef,
}: {
  target: THREE.Vector3 | null;
  playerRef: React.MutableRefObject<THREE.Vector3>;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (target) {
      const flat = new THREE.Vector3(target.x, 0, target.z);
      flat.x = THREE.MathUtils.clamp(flat.x, -2.6, 2.6);
      flat.z = THREE.MathUtils.clamp(flat.z, -32, 4);
      const dist = playerRef.current.distanceTo(flat);
      if (dist > 0.05) {
        playerRef.current.lerp(flat, Math.min(1, dt * 2.8));
      }
    }
    if (ref.current) {
      ref.current.position.set(playerRef.current.x, 0.9, playerRef.current.z);
    }
  });

  return (
    <group ref={ref} position={[0, 0.9, 2]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.22, 0.7, 6, 12]} />
        <meshStandardMaterial color="#2a323c" metalness={0.15} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#c8d0d8" />
      </mesh>
      <pointLight position={[0, 0.4, 0.3]} intensity={0.35} distance={3} color="#b8f000" />
    </group>
  );
}

export function PlaceMarkers({
  onPlace,
}: {
  onPlace: (p: QuayPlace) => void;
}) {
  // invisible helpers retained for future; doors handle enter
  void onPlace;
  return null;
}
