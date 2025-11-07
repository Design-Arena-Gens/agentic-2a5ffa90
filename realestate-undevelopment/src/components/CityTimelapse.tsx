"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Stars } from "@react-three/drei";
import { type ReactNode, useMemo, useRef } from "react";
import * as THREE from "three";
import { TIMELINE_DURATION } from "@/lib/timeline";

type BuildingSpec = {
  position: [number, number, number];
  footprint: [number, number];
  height: number;
  color: string;
};

const buildings: BuildingSpec[] = [
  { position: [-10, 0, -4], footprint: [4, 4], height: 9, color: "#99c4ff" },
  { position: [-4, 0, 2], footprint: [3, 5], height: 12, color: "#dce6ff" },
  { position: [2, 0, -3], footprint: [4.4, 4.4], height: 14, color: "#9ac7ff" },
  { position: [8, 0, 4], footprint: [3.6, 3.6], height: 11, color: "#f1f5ff" },
  { position: [12, 0, -2], footprint: [4.5, 3.2], height: 13, color: "#b6d6ff" },
  { position: [-14, 0, 5], footprint: [3.2, 3], height: 10, color: "#88bbff" },
];

function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function phaseProgress(t: number, start: number, end: number) {
  return THREE.MathUtils.clamp((t - start) / (end - start), 0, 1);
}

const Ground = () => {
  const groundMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1a2b1d",
        roughness: 1,
        metalness: 0,
      }),
    [],
  );

  const soilMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#33281e",
        roughness: 1,
        metalness: 0,
      }),
    [],
  );

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial
          color="#0e1216"
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[80, 80, 128, 128]} />
        <meshStandardMaterial color="#1c2f21" roughness={1} metalness={0} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#223524" roughness={1} metalness={0} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[40, 40]} />
        {soilMaterial && <primitive object={soilMaterial} />}
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <planeGeometry args={[38, 38]} />
        {groundMaterial && <primitive object={groundMaterial} />}
      </mesh>
    </group>
  );
};

const BlueprintGrid = () => {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame(({ clock }) => {
    const t = (clock.elapsedTime % TIMELINE_DURATION) / TIMELINE_DURATION;
    const appear = easeInOutCubic(phaseProgress(t, 0.05, 0.25));
    const fade = 1 - phaseProgress(t, 0.25, 0.4);
    const opacity = appear * fade;

    if (gridRef.current) {
      const material = gridRef.current.material;
      if (Array.isArray(material)) {
        material.forEach((mat) => {
          mat.opacity = opacity;
          mat.transparent = true;
          mat.depthWrite = false;
        });
      } else {
        material.opacity = opacity;
        material.transparent = true;
        material.depthWrite = false;
      }
      gridRef.current.rotation.y = clock.elapsedTime * 0.1;
    }
  });

  return (
    <gridHelper
      ref={gridRef}
      args={[70, 70, 0x2ddafc, 0x2ddafc]}
      position={[0, 0.04, 0]}
    />
  );
};

const Crane = ({
  position,
  delay = 0,
}: {
  position: [number, number, number];
  delay?: number;
}) => {
  const craneRef = useRef<THREE.Group>(null);
  const boomRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = (clock.elapsedTime % TIMELINE_DURATION) / TIMELINE_DURATION;
    const appear = phaseProgress(t, 0.32 + delay, 0.45 + delay);
    const disappear = 1 - phaseProgress(t, 0.7 + delay, 0.85 + delay);
    const active = easeInOutCubic(appear) * disappear;

    if (craneRef.current) {
      craneRef.current.visible = active > 0.02;
    }
    if (boomRef.current) {
      boomRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.2) * 0.4;
    }
  });

  return (
    <group ref={craneRef} position={position}>
      <mesh position={[0, 4.5, 0]}>
        <boxGeometry args={[0.25, 9, 0.25]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.4} roughness={0.7} />
      </mesh>
      <mesh ref={boomRef} position={[0, 9, 0]}>
        <boxGeometry args={[0.25, 0.25, 9]} />
        <meshStandardMaterial color="#facc15" metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.24, 6]} />
        <meshStandardMaterial color="#1e1e1e" />
      </mesh>
    </group>
  );
};

const RoadNetwork = () => {
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#14181f",
        metalness: 0.1,
        roughness: 0.6,
      }),
    [],
  );

  const laneMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#f8fafc",
      }),
    [],
  );

  return (
    <group position={[0, 0.051, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[38, 6]} />
        {material && <primitive object={material} />}
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <planeGeometry args={[6, 28]} />
        {material && <primitive object={material.clone()} />}
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <planeGeometry args={[0.3, 26]} />
        {laneMaterial && <primitive object={laneMaterial} />}
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <planeGeometry args={[30, 0.3]} />
        {laneMaterial && <primitive object={laneMaterial.clone()} />}
      </mesh>
    </group>
  );
};

const Tree = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = (clock.elapsedTime % TIMELINE_DURATION) / TIMELINE_DURATION;
    const appear = easeInOutCubic(phaseProgress(t, 0.7, 0.95));
    if (groupRef.current) {
      groupRef.current.visible = appear > 0.02;
      groupRef.current.scale.setScalar(appear);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1.4, 8]} />
        <meshStandardMaterial color="#4f3d30" />
      </mesh>
      <mesh position={[0, 1.6, 0]}>
        <coneGeometry args={[0.8, 1.6, 12]} />
        <meshStandardMaterial color="#3b8250" roughness={0.8} metalness={0} />
      </mesh>
    </group>
  );
};

const Building = ({ spec }: { spec: BuildingSpec }) => {
  const foundationRef = useRef<THREE.Mesh>(null);
  const skeletonRef = useRef<THREE.Mesh>(null);
  const facadeRef = useRef<THREE.Mesh>(null);

  const skeletonMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#9be5ff",
        transparent: true,
        opacity: 0,
        wireframe: true,
      }),
    [],
  );

  const facadeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: spec.color,
        roughness: 0.35,
        metalness: 0.7,
        transparent: true,
        opacity: 0,
      }),
    [spec.color],
  );

  useFrame(({ clock }) => {
    const t = (clock.elapsedTime % TIMELINE_DURATION) / TIMELINE_DURATION;
    const { footprint, height } = spec;

    const foundationProgress = easeInOutCubic(phaseProgress(t, 0.25, 0.43));
    const skeletonProgress = easeInOutCubic(phaseProgress(t, 0.43, 0.63));
    const facadeProgress = easeInOutCubic(phaseProgress(t, 0.63, 0.88));
    const resetProgress = phaseProgress(t, 0.9, 1);
    const fade = 1 - resetProgress;

    if (foundationRef.current) {
      const foundationHeight = Math.max(height * 0.25 * foundationProgress, 0.04);
      foundationRef.current.scale.set(
        footprint[0],
        foundationHeight,
        footprint[1],
      );
      foundationRef.current.position.y = foundationHeight / 2;
      const mat = foundationRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = fade;
      mat.transparent = true;
      mat.color.setHex(0x8f8a87);
    }

    if (skeletonRef.current) {
      skeletonRef.current.scale.set(footprint[0], height, footprint[1]);
      skeletonRef.current.position.y = height / 2;
      skeletonRef.current.visible = skeletonProgress > 0;
    }

    if (facadeRef.current) {
      facadeRef.current.scale.set(footprint[0], height, footprint[1]);
      facadeRef.current.position.y = height / 2;
      facadeRef.current.visible = facadeProgress > 0.02;
    }

    if (skeletonRef.current) {
      const mat = skeletonRef.current
        .material as THREE.MeshBasicMaterial;
      mat.opacity = skeletonProgress * fade;
    }

    if (facadeRef.current) {
      const mat = facadeRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = Math.min(1, facadeProgress) * fade;
    }
  });

  return (
    <group position={spec.position}>
      <mesh ref={foundationRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial transparent />
      </mesh>
      <mesh ref={skeletonRef} material={skeletonMaterial}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      <mesh ref={facadeRef} material={facadeMaterial}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
    </group>
  );
};

const SkylineGlow = () => {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = (clock.elapsedTime % TIMELINE_DURATION) / TIMELINE_DURATION;
    const appear = easeInOutCubic(phaseProgress(t, 0.65, 0.9));
    const intensity = 0.15 + appear * 0.25;
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = intensity;
    }
  });

  return (
    <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <circleGeometry args={[50, 64]} />
      <meshBasicMaterial color="#60a5fa" transparent opacity={0} />
    </mesh>
  );
};

const Trees = () => {
  const treePositions: [number, number, number][] = useMemo(
    () => [
      [-16, 0, -6],
      [-12, 0, 10],
      [-6, 0, 14],
      [6, 0, 15],
      [12, 0, -8],
      [16, 0, 8],
      [4, 0, -14],
      [-4, 0, -12],
    ],
    [],
  );

  return (
    <group>
      {treePositions.map((position, index) => (
        <Tree key={`${position[0]}-${index}`} position={position} />
      ))}
    </group>
  );
};

const CityTimelapseScene = () => {
  const sunRef = useRef<THREE.DirectionalLight>(null);

  useFrame(({ clock }) => {
    if (!sunRef.current) return;
    const t = clock.elapsedTime * 0.1;
    sunRef.current.position.set(
      Math.sin(t) * 40,
      25 + Math.sin(t * 0.5) * 5,
      Math.cos(t) * 40,
    );
  });

  return (
    <>
      <color attach="background" args={["#030712"]} />
      <fog attach="fog" args={["#030712", 40, 220]} />
      <ambientLight intensity={0.4} />
      <directionalLight
        ref={sunRef}
        intensity={1.2}
        color="#9ec5ff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <hemisphereLight intensity={0.35} color="#8bb6ff" groundColor="#294051" />
      <Ground />
      <BlueprintGrid />
      <SkylineGlow />
      <RoadNetwork />
      {buildings.map((spec) => (
        <Building key={spec.position.join("-")} spec={spec} />
      ))}
      <Crane position={[-12, 0, -2]} delay={0} />
      <Crane position={[10, 0, 6]} delay={0.05} />
      <Trees />
      <Stars
        radius={120}
        depth={60}
        count={2200}
        factor={2}
        fade
        speed={0.4}
      />
      <Environment preset="sunset" />
    </>
  );
};

const CanvasWrapper = ({ children }: { children: ReactNode }) => (
  <Canvas
    camera={{ position: [28, 18, 28], fov: 40 }}
    shadows
    onCreated={({ camera }) => {
      camera.lookAt(0, 4, 0);
    }}
  >
    {children}
  </Canvas>
);

export const CityTimelapse = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0b1c2d,transparent_60%)]" />
    <CanvasWrapper>
      <CityTimelapseScene />
    </CanvasWrapper>
  </div>
);
