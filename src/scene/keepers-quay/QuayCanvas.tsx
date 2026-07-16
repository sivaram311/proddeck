"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { GateLantern, ManifestHall, MemoryShed, WatchLoft } from "./Buildings";
import { KeeperHumanoid } from "./Characters";
import { FabricBuoys, PortBollards, TideGauges } from "./fx/OsEchoMeshes";
import { useBeatBus, useQuayQuality } from "./hooks/useBeatBus";
import { PierDeck, QuayWater } from "./PierWater";
import type { QuaySceneProps } from "./types";

function NightLights() {
  return (
    <>
      <color attach="background" args={["#060a10"]} />
      <fog attach="fog" args={["#060a10", 18, 55]} />
      <hemisphereLight args={["#1a2838", "#050608", 0.55]} />
      <directionalLight
        castShadow
        position={[-6, 10, 4]}
        intensity={0.45}
        color="#8aa0b8"
        shadow-mapSize={[1024, 1024]}
      />
      <ambientLight intensity={0.12} />
    </>
  );
}

function FollowCam({ playerRef }: { playerRef: React.MutableRefObject<THREE.Vector3> }) {
  const { camera } = useThree();
  const desired = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());
  useFrame(() => {
    const p = playerRef.current;
    desired.current.set(p.x + 4.5, 5.4, p.z + 7.5);
    camera.position.lerp(desired.current, 0.08);
    look.current.set(p.x, 1.35, p.z - 2);
    camera.lookAt(look.current);
  });
  return null;
}

function QuayWorld(props: QuaySceneProps) {
  const [walkTarget, setWalkTarget] = useState<THREE.Vector3 | null>(null);
  const playerRef = useRef(new THREE.Vector3(0, 0, 2.2));
  useBeatBus();
  const quality = useQuayQuality();
  const echo = props.osEcho;
  const showFx = quality !== "low" || Boolean(echo?.fabricLanes?.length || echo?.pulse);

  return (
    <>
      <NightLights />
      <FollowCam playerRef={playerRef} />
      <QuayWater wakeToken={props.wakeToken} />
      <PierDeck
        onWalk={(p) => {
          setWalkTarget(p);
          props.onPlace("pier");
        }}
      />
      <GateLantern acknowledge={props.gateAck || echo?.cssFresh === true} />
      <ManifestHall
        apps={props.apps}
        active={props.place === "manifest"}
        pendingSlug={props.pendingSlug}
        wakeToken={props.wakeToken}
        onEnter={() => props.onPlace("manifest")}
        onSelectApp={props.onSelectApp}
      />
      <MemoryShed
        active={props.place === "shed"}
        ticketToken={props.ticketToken}
        onEnter={() => props.onPlace("shed")}
      />
      <WatchLoft
        crews={props.crews}
        active={props.place === "loft"}
        loftAck={props.loftAck}
        onEnter={() => props.onPlace("loft")}
      />
      {showFx ? (
        <>
          <TideGauges pulse={echo?.pulse} />
          <PortBollards ports={echo?.ports} />
          <FabricBuoys lanes={echo?.fabricLanes} />
        </>
      ) : null}
      <KeeperHumanoid
        target={walkTarget}
        playerRef={playerRef}
        place={props.place}
        action={props.keeperAction}
        actionToken={props.actionToken}
      />
      <mesh position={[18, 1.5, -40]}>
        <boxGeometry args={[20, 4, 4]} />
        <meshStandardMaterial color="#0a1016" roughness={1} />
      </mesh>
      <mesh position={[-16, 1.2, -38]}>
        <boxGeometry args={[14, 3.2, 4]} />
        <meshStandardMaterial color="#0a1016" roughness={1} />
      </mesh>
    </>
  );
}

export function QuayCanvas(props: QuaySceneProps) {
  if (props.webglFailed) return null;
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        shadows={false}
        dpr={[1, 1.5]}
        camera={{ fov: 45, near: 0.1, far: 80, position: [5, 5.5, 10] }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor("#060a10");
          gl.domElement.addEventListener(
            "webglcontextlost",
            (e) => {
              e.preventDefault();
              props.onWebglFail();
            },
            false,
          );
        }}
      >
        <QuayWorld {...props} />
      </Canvas>
    </div>
  );
}
