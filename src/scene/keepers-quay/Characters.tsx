"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { QuayPlace } from "./types";

export type KeeperAction = "idle" | "walk" | "enter" | "call" | "nail" | "scan";

/** Procedural Keeper humanoid — AgentVerse-lite limbs, no sit/greet. */
export function KeeperHumanoid({
  target,
  playerRef,
  place,
  action,
  actionToken,
}: {
  target: THREE.Vector3 | null;
  playerRef: React.MutableRefObject<THREE.Vector3>;
  place: QuayPlace;
  action: KeeperAction;
  actionToken: number;
}) {
  const root = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const chestGlow = useRef<THREE.MeshStandardMaterial>(null);
  const walkPhase = useRef(0);
  const actionT = useRef(0);
  const lastActionToken = useRef(actionToken);
  const facing = useRef(0);
  const moving = useRef(false);

  useFrame((_, dt) => {
    const g = root.current;
    if (!g) return;
    const clamped = Math.min(dt, 0.05);

    if (actionToken !== lastActionToken.current) {
      lastActionToken.current = actionToken;
      actionT.current = 0.001;
    }
    if (actionT.current > 0) actionT.current += clamped;

    moving.current = false;
    if (target) {
      const flat = new THREE.Vector3(target.x, 0, target.z);
      flat.x = THREE.MathUtils.clamp(flat.x, -2.6, 2.6);
      flat.z = THREE.MathUtils.clamp(flat.z, -32, 4);
      const dist = playerRef.current.distanceTo(flat);
      if (dist > 0.08) {
        const before = playerRef.current.clone();
        playerRef.current.lerp(flat, Math.min(1, clamped * 2.8));
        const dir = playerRef.current.clone().sub(before);
        if (dir.lengthSq() > 1e-6) {
          facing.current = Math.atan2(dir.x, dir.z);
          moving.current = true;
        }
      }
    }

    g.position.set(playerRef.current.x, 0, playerRef.current.z);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, facing.current, 0.15);

    const effective: KeeperAction =
      actionT.current > 0 && actionT.current < 0.85
        ? action
        : moving.current
          ? "walk"
          : place === "loft"
            ? "scan"
            : "idle";

    if (effective === "walk") {
      walkPhase.current += clamped * 9;
      const s = Math.sin(walkPhase.current);
      const c = Math.cos(walkPhase.current);
      if (legL.current) legL.current.rotation.x = s * 0.55;
      if (legR.current) legR.current.rotation.x = -s * 0.55;
      if (armL.current) armL.current.rotation.x = -s * 0.45;
      if (armR.current) armR.current.rotation.x = s * 0.45;
      if (torso.current) torso.current.position.y = 1.05 + Math.abs(c) * 0.03;
    } else {
      walkPhase.current *= 0.9;
      const breathe = Math.sin(performance.now() * 0.002) * 0.02;
      if (legL.current) legL.current.rotation.x = THREE.MathUtils.lerp(legL.current.rotation.x, 0, 0.2);
      if (legR.current) legR.current.rotation.x = THREE.MathUtils.lerp(legR.current.rotation.x, 0, 0.2);
      if (torso.current) torso.current.position.y = 1.05 + breathe;
    }

    const tAct = actionT.current;
    if (armR.current && armL.current && head.current) {
      if (effective === "call" && tAct > 0) {
        const u = Math.min(1, tAct / 0.5);
        armR.current.rotation.x = -u * 1.4;
        armR.current.rotation.z = -u * 0.3;
      } else if (effective === "nail" && tAct > 0) {
        const u = Math.sin(Math.min(Math.PI, tAct * 8));
        armR.current.rotation.x = -0.8 - u * 0.5;
      } else if (effective === "enter" && tAct > 0) {
        armR.current.rotation.x = -0.6;
        armL.current.rotation.x = -0.4;
      } else if (effective === "scan") {
        head.current.rotation.x = -0.25 + Math.sin(performance.now() * 0.001) * 0.05;
        armL.current.rotation.x = THREE.MathUtils.lerp(armL.current.rotation.x, 0, 0.15);
        armR.current.rotation.x = THREE.MathUtils.lerp(armR.current.rotation.x, 0, 0.15);
      } else if (effective === "idle") {
        armL.current.rotation.x = THREE.MathUtils.lerp(armL.current.rotation.x, 0.05, 0.12);
        armR.current.rotation.x = THREE.MathUtils.lerp(armR.current.rotation.x, -0.05, 0.12);
        head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, 0, 0.1);
      }
    }

    if (chestGlow.current) {
      chestGlow.current.emissiveIntensity = 0.45 + Math.sin(performance.now() * 0.003) * 0.25;
    }

    if (actionT.current > 0.9) actionT.current = 0;
  });

  const coat = useMemo(() => "#1c242e", []);
  const trim = useMemo(() => "#2a323c", []);

  return (
    <group ref={root} position={[0, 0, 2.2]}>
      {/* legs */}
      <group ref={legL} position={[-0.14, 0.55, 0]}>
        <mesh position={[0, -0.28, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.4, 4, 8]} />
          <meshStandardMaterial color={trim} roughness={0.85} />
        </mesh>
      </group>
      <group ref={legR} position={[0.14, 0.55, 0]}>
        <mesh position={[0, -0.28, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.4, 4, 8]} />
          <meshStandardMaterial color={trim} roughness={0.85} />
        </mesh>
      </group>
      {/* torso + collar */}
      <group ref={torso} position={[0, 1.05, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.22, 0.45, 6, 12]} />
          <meshStandardMaterial color={coat} metalness={0.2} roughness={0.65} />
        </mesh>
        <mesh position={[0, 0.15, 0.18]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial
            ref={chestGlow}
            color="#b8f000"
            emissive="#b8f000"
            emissiveIntensity={0.6}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 0.42, 0]} castShadow>
          <coneGeometry args={[0.28, 0.22, 8]} />
          <meshStandardMaterial color="#121820" />
        </mesh>
        <group ref={head} position={[0, 0.52, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial color="#c8d0d8" roughness={0.7} />
          </mesh>
        </group>
        <group ref={armL} position={[-0.32, 0.2, 0]}>
          <mesh position={[0, -0.28, 0]} castShadow>
            <capsuleGeometry args={[0.07, 0.38, 4, 8]} />
            <meshStandardMaterial color={coat} />
          </mesh>
        </group>
        <group ref={armR} position={[0.32, 0.2, 0]}>
          <mesh position={[0, -0.28, 0]} castShadow>
            <capsuleGeometry args={[0.07, 0.38, 4, 8]} />
            <meshStandardMaterial color={coat} />
          </mesh>
        </group>
      </group>
      <pointLight position={[0, 1.2, 0.35]} intensity={0.4} distance={3.5} color="#b8f000" />
    </group>
  );
}

export function WatchSilhouette({
  position,
  acknowledge,
  delay = 0,
}: {
  position: [number, number, number];
  acknowledge: boolean;
  delay?: number;
  label?: string;
}) {
  const root = useRef<THREE.Group>(null);
  const baseYaw = useRef(Math.PI);
  const started = useRef(0);

  useFrame((_, dt) => {
    if (!root.current) return;
    if (acknowledge) {
      if (started.current === 0) started.current = performance.now() + delay * 1000;
      if (performance.now() >= started.current) {
        const target = 0; // face toward door / keeper approach (+Z-ish chart side)
        root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, target, 0.08);
      }
    } else {
      started.current = 0;
      root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, baseYaw.current, 0.06);
    }
    const breathe = 1 + Math.sin(performance.now() * 0.002 + delay) * 0.015;
    root.current.scale.y = breathe;
  });

  return (
    <group ref={root} position={position}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.45, 4, 8]} />
        <meshStandardMaterial
          color="#0a0e12"
          emissive={acknowledge ? "#b8f000" : "#4a6070"}
          emissiveIntensity={acknowledge ? 0.55 : 0.35}
        />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.13, 12, 12]} />
        <meshStandardMaterial color="#1a222c" emissive="#4a6070" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}
