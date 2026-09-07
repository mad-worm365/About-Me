"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Group, Points } from "three";

function Dolphin() {
  const group = useRef<Group>(null);

  const body = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-1.75, 0.02);
    shape.bezierCurveTo(-1.55, 0.5, -0.85, 0.62, -0.15, 0.4);
    shape.bezierCurveTo(0.45, 0.24, 1.0, 0.18, 1.45, 0.08);
    shape.bezierCurveTo(1.78, 0.02, 2.05, -0.02, 2.2, -0.08);
    shape.bezierCurveTo(1.95, -0.2, 1.5, -0.24, 1.05, -0.2);
    shape.bezierCurveTo(0.4, -0.16, -0.2, -0.24, -0.75, -0.18);
    shape.bezierCurveTo(-1.25, -0.12, -1.65, -0.04, -1.75, 0.02);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.5,
      bevelEnabled: true,
      bevelThickness: 0.07,
      bevelSize: 0.05,
      bevelSegments: 2,
      curveSegments: 28,
    });
    geo.center();
    geo.rotateY(Math.PI / 2);
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.position.y = Math.sin(t * 0.85) * 0.1;
    group.current.rotation.x = Math.sin(t * 0.45) * 0.04;
  });

  return (
    <group ref={group} scale={1.25}>
      <mesh geometry={body}>
        <meshBasicMaterial color="#6d28d9" transparent opacity={0.18} />
      </mesh>
      <mesh geometry={body}>
        <meshBasicMaterial color="#67e8f9" wireframe transparent opacity={0.9} />
      </mesh>

      <mesh position={[0.2, 0.52, 0]} rotation={[0, 0, 0.1]}>
        <coneGeometry args={[0.22, 0.5, 4]} />
        <meshBasicMaterial color="#67e8f9" wireframe />
      </mesh>
      <mesh position={[-1.45, 0.02, 0.2]} rotation={[0.55, 0.1, 0.15]}>
        <boxGeometry args={[0.12, 0.5, 0.06]} />
        <meshBasicMaterial color="#67e8f9" wireframe />
      </mesh>
      <mesh position={[-1.45, 0.02, -0.2]} rotation={[-0.55, -0.1, -0.15]}>
        <boxGeometry args={[0.12, 0.5, 0.06]} />
        <meshBasicMaterial color="#67e8f9" wireframe />
      </mesh>
      <mesh position={[0.85, -0.3, 0.3]} rotation={[0.6, 0.25, 0.35]} scale={[0.45, 0.55, 0.12]}>
        <boxGeometry args={[0.55, 0.75, 0.08]} />
        <meshBasicMaterial color="#67e8f9" wireframe />
      </mesh>
      <mesh position={[0.85, -0.3, -0.3]} rotation={[-0.6, -0.25, -0.35]} scale={[0.45, 0.55, 0.12]}>
        <boxGeometry args={[0.55, 0.75, 0.08]} />
        <meshBasicMaterial color="#67e8f9" wireframe />
      </mesh>
    </group>
  );
}

function Wake() {
  const ref = useRef<Points>(null);
  const count = 160;
  const positions = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      data[i * 3] = -1 - Math.random() * 2.5;
      data[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      data[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    return data;
  }, []);

  useFrame(() => {
    const points = ref.current;
    if (!points) return;
    const attr = points.geometry.attributes.position;
    for (let i = 0; i < count; i += 1) {
      let x = attr.getX(i) - 0.015;
      if (x < -4) x = -1;
      attr.setX(i, x);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#67e8f9" size={0.04} transparent opacity={0.8} depthWrite={false} sizeAttenuation />
    </points>
  );
}

function Dust() {
  const ref = useRef<Points>(null);
  const count = 700;
  const positions = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      data[i * 3] = (Math.random() - 0.5) * 16;
      data[i * 3 + 1] = (Math.random() - 0.5) * 9;
      data[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return data;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.015;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#3b82f6" size={0.018} transparent opacity={0.32} depthWrite={false} />
    </points>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#030712"]} />
      <fog attach="fog" args={["#030712", 7, 20]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[3, 2, 4]} color="#67e8f9" intensity={1.1} />
      <pointLight position={[-3, -1, -2]} color="#8b5cf6" intensity={0.7} />
      <Stars radius={50} depth={40} count={1400} factor={2.2} saturation={0} fade speed={0.35} />
      <Dust />
      <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.28}>
        <group position={[0.35, 0.2, 0]} rotation={[0.12, -0.6, 0.05]}>
          <Dolphin />
          <Wake />
        </group>
      </Float>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom
        enableRotate
        minDistance={3}
        maxDistance={8.5}
        enableDamping
        dampingFactor={0.07}
        rotateSpeed={0.75}
        zoomSpeed={0.5}
        autoRotate
        autoRotateSpeed={0.4}
        maxPolarAngle={Math.PI * 0.8}
        minPolarAngle={Math.PI * 0.25}
      />
    </>
  );
}

export default function CyberOceanBackground() {
  return (
    <div className="cyber-ocean-bg" aria-hidden>
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0.15, 0.55, 5], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <div className="cyber-ocean-veil" />
    </div>
  );
}
