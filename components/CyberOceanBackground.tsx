"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, useAnimations, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import type { Group, Points } from "three";

const SWIM_DURATION = 14;
const PATH_RADIUS = 3.6;

function createSwimPath() {
  const points: THREE.Vector3[] = [];
  const segments = 12;
  for (let i = 0; i < segments; i += 1) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(
      new THREE.Vector3(
        Math.cos(angle) * PATH_RADIUS,
        Math.sin(angle * 2) * 0.45,
        Math.sin(angle) * PATH_RADIUS * 0.85,
      ),
    );
  }
  return new THREE.CatmullRomCurve3(points, true, "centripetal", 0.5);
}

function AnimatedDolphin({ path }: { path: THREE.CatmullRomCurve3 }) {
  // Outer group = path motion only (never bound to animation mixer)
  const pathGroup = useRef<Group>(null);
  // Inner group = skinned model + swim animation
  const animGroup = useRef<Group>(null);
  const lookTarget = useRef(new THREE.Vector3());
  const { scene, animations } = useGLTF("/models/dolphin_anim.glb");

  const model = useMemo(() => {
    const clone = SkeletonUtils.clone(scene);
    clone.position.set(0, 0, 0);
    clone.rotation.set(0, 0, 0);
    clone.scale.set(1, 1, 1);
    clone.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.frustumCulled = false;
      // Neutralize any baked root offset so path radius is visible
      if (mesh.parent === clone) {
        mesh.position.set(0, 0, 0);
      }
      mesh.material = new THREE.MeshBasicMaterial({
        color: "#7dd3fc",
        wireframe: true,
        transparent: true,
        opacity: 0.95,
      });
    });
    return clone;
  }, [scene]);

  const { actions, mixer } = useAnimations(animations, animGroup);

  useEffect(() => {
    const clipName = Object.keys(actions)[0];
    const action = clipName ? actions[clipName] : null;
    if (!action) return;

    // Strip root translation tracks so animation doesn't cancel the path orbit
    const clip = action.getClip();
    clip.tracks = clip.tracks.filter((track) => {
      const name = track.name.toLowerCase();
      return !(
        name.endsWith(".position") &&
        (name.includes("root") || name.includes("hips") || name.startsWith("dolphin"))
      );
    });

    action.reset();
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.setEffectiveTimeScale(1.3);
    action.setEffectiveWeight(1);
    action.fadeIn(0.3).play();

    return () => {
      action.fadeOut(0.15);
    };
  }, [actions]);

  useFrame(({ clock }, delta) => {
    mixer?.update(delta);
    if (!pathGroup.current) return;

    const t = (clock.elapsedTime % SWIM_DURATION) / SWIM_DURATION;
    const point = path.getPointAt(t);
    const tangent = path.getTangentAt(t).normalize();

    pathGroup.current.position.set(point.x, point.y, point.z);
    pathGroup.current.position.y += Math.sin(clock.elapsedTime * 2.2) * 0.08;

    lookTarget.current.copy(point).addScaledVector(tangent, 2);
    pathGroup.current.lookAt(lookTarget.current);
    pathGroup.current.rotateY(Math.PI);

    if (animGroup.current) {
      animGroup.current.rotation.z = Math.sin(clock.elapsedTime * 2.1) * 0.12;
      animGroup.current.rotation.x = Math.sin(clock.elapsedTime * 1.6) * 0.06;
    }
  });

  return (
    <group ref={pathGroup}>
      <group ref={animGroup} scale={1.4}>
        <primitive object={model} />
      </group>
    </group>
  );
}

function PathWake({ path }: { path: THREE.CatmullRomCurve3 }) {
  const ref = useRef<Points>(null);
  const count = 260;
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
      const trail = (base - offsets[i] * 0.28 + 1) % 1;
      const p = path.getPointAt(trail);
      const spread = 0.05 + offsets[i] * 0.1;
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

function PathGuide({ path }: { path: THREE.CatmullRomCurve3 }) {
  const geometry = useMemo(() => {
    const points = path.getPoints(128);
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [path]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#22d3ee" transparent opacity={0.22} />
    </line>
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
  const path = useMemo(() => createSwimPath(), []);

  return (
    <>
      <color attach="background" args={["#030712"]} />
      <fog attach="fog" args={["#030712", 8, 24]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 3, 5]} color="#67e8f9" intensity={1.35} />
      <pointLight position={[-4, -1, -3]} color="#8b5cf6" intensity={0.9} />
      <Stars radius={55} depth={40} count={1600} factor={2.4} saturation={0} fade speed={0.4} />
      <OceanDust />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.35, 0]}>
        <planeGeometry args={[26, 26, 52, 52]} />
        <meshBasicMaterial color="#1e3a8a" wireframe transparent opacity={0.15} />
      </mesh>
      <PathGuide path={path} />
      <Suspense fallback={null}>
        <AnimatedDolphin path={path} />
        <PathWake path={path} />
      </Suspense>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom
        enableRotate
        minDistance={4}
        maxDistance={12}
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
        camera={{ position: [0, 2.2, 8], fov: 42 }}
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
