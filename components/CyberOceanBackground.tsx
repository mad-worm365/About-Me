"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, useAnimations, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import type { Group, Points } from "three";

const SWIM_DURATION = 16;

function useSwimPath() {
  return useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(2.5, 0.25, 1.0),
        new THREE.Vector3(1.4, 0.65, -1.3),
        new THREE.Vector3(-0.5, 0.2, -2.3),
        new THREE.Vector3(-2.4, -0.05, -0.7),
        new THREE.Vector3(-1.8, 0.5, 1.4),
        new THREE.Vector3(0.2, 0.75, 2.2),
        new THREE.Vector3(2.1, 0.3, 1.7),
      ],
      true,
      "catmullrom",
      0.4,
    );
    return curve;
  }, []);
}

function AnimatedDolphin({ path }: { path: THREE.CatmullRomCurve3 }) {
  const group = useRef<Group>(null);
  const lookAt = useRef(new THREE.Vector3());
  const { scene, animations } = useGLTF("/models/dolphin_anim.glb");

  const model = useMemo(() => {
    const clone = SkeletonUtils.clone(scene);
    clone.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.frustumCulled = false;
      mesh.material = new THREE.MeshBasicMaterial({
        color: "#7dd3fc",
        wireframe: true,
        transparent: true,
        opacity: 0.95,
      });
    });
    return clone;
  }, [scene]);

  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    const names = Object.keys(actions);
    const action = names.length ? actions[names[0]] : null;
    if (!action) return;

    action.reset();
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.setEffectiveTimeScale(1.25);
    action.setEffectiveWeight(1);
    action.fadeIn(0.35).play();

    return () => {
      action.fadeOut(0.2);
    };
  }, [actions]);

  useFrame(({ clock }, delta) => {
    mixer?.update(delta);
    if (!group.current) return;

    const t = (clock.elapsedTime % SWIM_DURATION) / SWIM_DURATION;
    const point = path.getPointAt(t);
    const tangent = path.getTangentAt(t).normalize();

    group.current.position.copy(point);
    group.current.position.y += Math.sin(clock.elapsedTime * 2.4) * 0.07;

    lookAt.current.copy(point).addScaledVector(tangent, 1);
    group.current.lookAt(lookAt.current);
    group.current.rotateY(Math.PI);
    group.current.rotateZ(Math.sin(clock.elapsedTime * 2.0) * 0.1);
    group.current.rotateX(Math.sin(clock.elapsedTime * 1.5) * 0.05);
  });

  return (
    <group ref={group} scale={1.45}>
      <primitive object={model} />
    </group>
  );
}

function PathWake({ path }: { path: THREE.CatmullRomCurve3 }) {
  const ref = useRef<Points>(null);
  const count = 240;
  const offsets = useMemo(
    () => Float32Array.from({ length: count }, () => Math.random()),
    [],
  );
  const positions = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const p = path.getPointAt(i / count);
      data[i * 3] = p.x;
      data[i * 3 + 1] = p.y;
      data[i * 3 + 2] = p.z;
    }
    return data;
  }, [path]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const attr = ref.current.geometry.attributes.position;
    const base = (clock.elapsedTime % SWIM_DURATION) / SWIM_DURATION;

    for (let i = 0; i < count; i += 1) {
      const trail = (base - offsets[i] * 0.25 + 1) % 1;
      const p = path.getPointAt(trail);
      const spread = offsets[i] * 0.12;
      attr.setXYZ(
        i,
        p.x + Math.sin(i + clock.elapsedTime) * spread,
        p.y + Math.cos(i * 0.7 + clock.elapsedTime) * spread,
        p.z + Math.sin(i * 1.3) * spread,
      );
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#67e8f9"
        size={0.04}
        transparent
        opacity={0.7}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function OceanDust() {
  const ref = useRef<Points>(null);
  const count = 1000;
  const positions = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      data[i * 3] = (Math.random() - 0.5) * 18;
      data[i * 3 + 1] = (Math.random() - 0.5) * 10;
      data[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return data;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#3b82f6" size={0.016} transparent opacity={0.28} depthWrite={false} />
    </points>
  );
}

function Scene() {
  const path = useSwimPath();

  return (
    <>
      <color attach="background" args={["#030712"]} />
      <fog attach="fog" args={["#030712", 8, 22]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 3, 5]} color="#67e8f9" intensity={1.35} />
      <pointLight position={[-4, -1, -3]} color="#8b5cf6" intensity={0.9} />
      <Stars radius={55} depth={40} count={1600} factor={2.4} saturation={0} fade speed={0.4} />
      <OceanDust />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.35, 0]}>
        <planeGeometry args={[26, 26, 52, 52]} />
        <meshBasicMaterial color="#1e3a8a" wireframe transparent opacity={0.15} />
      </mesh>
      <Suspense fallback={null}>
        <AnimatedDolphin path={path} />
        <PathWake path={path} />
      </Suspense>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom
        enableRotate
        minDistance={3.2}
        maxDistance={9}
        enableDamping
        dampingFactor={0.07}
        rotateSpeed={0.7}
        zoomSpeed={0.5}
        maxPolarAngle={Math.PI * 0.82}
        minPolarAngle={Math.PI * 0.22}
      />
    </>
  );
}

export default function CyberOceanBackground() {
  return (
    <div className="cyber-ocean-bg" aria-hidden>
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0.5, 1.2, 5.6], fov: 42 }}
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

useGLTF.preload("/models/dolphin_anim.glb");
