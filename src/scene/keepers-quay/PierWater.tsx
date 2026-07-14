"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/** Night water plane with soft ripple + lime wake line on launch. */
export function QuayWater({ wakeToken }: { wakeToken: number }) {
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const wake = useRef(0);
  const lastToken = useRef(wakeToken);

  useFrame((_, dt) => {
    if (wakeToken !== lastToken.current) {
      lastToken.current = wakeToken;
      wake.current = 1;
    }
    if (wake.current > 0) wake.current = Math.max(0, wake.current - dt * 0.55);
    if (mat.current) {
      const pulse = 0.04 + wake.current * 0.35;
      mat.current.emissiveIntensity = pulse;
    }
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.35, -14]} receiveShadow>
        <planeGeometry args={[48, 56]} />
        <meshStandardMaterial
          ref={mat}
          color="#060a10"
          metalness={0.72}
          roughness={0.28}
          emissive="#b8f000"
          emissiveIntensity={0.04}
        />
      </mesh>
      {/* Far shore answer light */}
      <mesh position={[14, 1.2, -36]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial
          color="#b8f000"
          emissive="#b8f000"
          emissiveIntensity={wakeToken > 0 ? 1.4 : 0.15}
          toneMapped={false}
        />
      </mesh>
      <WakeRibbon wakeToken={wakeToken} />
    </group>
  );
}

function WakeRibbon({ wakeToken }: { wakeToken: number }) {
  const line = useRef<THREE.Mesh>(null);
  const t = useRef(0);
  const last = useRef(wakeToken);

  useFrame((_, dt) => {
    if (wakeToken !== last.current) {
      last.current = wakeToken;
      t.current = 0.001;
    }
    if (t.current <= 0 || !line.current) return;
    t.current += dt;
    const u = Math.min(1, t.current / 1.1);
    line.current.scale.set(1, 1, 0.05 + u * 22);
    line.current.position.z = -8 - u * 14;
    const opacity = u < 0.7 ? 0.85 : Math.max(0, 1 - (u - 0.7) / 0.3);
    const m = line.current.material as THREE.MeshBasicMaterial;
    m.opacity = opacity;
    if (u >= 1) t.current = 0;
  });

  return (
    <mesh ref={line} position={[0, -0.2, -8]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.12, 1]} />
      <meshBasicMaterial color="#b8f000" transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

export function PierDeck({ onWalk }: { onWalk: (p: THREE.Vector3) => void }) {
  const points = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let z = 4; z >= -32; z -= 2.2) arr.push([0, 0.02, z]);
    return arr;
  }, []);

  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, -12]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onWalk(e.point.clone());
        }}
      >
        <planeGeometry args={[6.4, 40]} />
        <meshStandardMaterial color="#1a1510" roughness={0.92} metalness={0.05} />
      </mesh>
      {/* Plank lines */}
      {Array.from({ length: 18 }).map((_, i) => (
        <mesh key={i} position={[0, 0.03, 3 - i * 2.1]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6.2, 0.04]} />
          <meshStandardMaterial color="#0d0b09" roughness={1} />
        </mesh>
      ))}
      {/* Lime path studs */}
      {points.map((p, i) => (
        <mesh
          key={i}
          position={p}
          onClick={(e) => {
            e.stopPropagation();
            onWalk(new THREE.Vector3(p[0], 0, p[2]));
          }}
        >
          <cylinderGeometry args={[0.08, 0.08, 0.04, 10]} />
          <meshStandardMaterial
            color="#b8f000"
            emissive="#b8f000"
            emissiveIntensity={0.55}
            toneMapped={false}
          />
        </mesh>
      ))}
      {/* Pier posts */}
      {[-2.8, 2.8].map((x) =>
        [-2, -10, -18, -26].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, -0.9, z]} castShadow>
            <cylinderGeometry args={[0.12, 0.14, 1.8, 8]} />
            <meshStandardMaterial color="#2a2218" roughness={0.95} />
          </mesh>
        )),
      )}
    </group>
  );
}
