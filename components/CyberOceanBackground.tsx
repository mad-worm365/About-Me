"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, useAnimations, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { SkeletonUtils } from "three-stdlib";
import type { Group, Points, LineSegments, SkinnedMesh } from "three";

const DOLPHIN_VERT = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
#include <skinning_pars_vertex>
void main() {
  #include <skinbase_vertex>
  #include <begin_vertex>
  #include <skinning_vertex>
  #include <project_vertex>
  vec4 modelPosition = modelMatrix * vec4(transformed, 1.0);
  gl_Position = projectionMatrix * viewMatrix * modelPosition;
  vUv = uv;
  vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
  vPosition = modelPosition.xyz;
}
`;

const DOLPHIN_FRAG = /* glsl */ `
uniform vec3 uBaseColor;
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  vec3 normal = normalize(vNormal);
  if (!gl_FrontFacing) normal *= -1.0;
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  float fresnel = pow(dot(viewDirection, normal) + 1.0, 2.5);
  gl_FragColor = vec4(uBaseColor, fresnel);
}
`;

const SPARKLE_VERT = /* glsl */ `
uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;
attribute float aRandom;
attribute float aSize;
varying float vRandom;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float sizeVariation = aSize * (0.5 + 0.5 * sin(uTime * 2.0 + aRandom * 6.28));
  gl_PointSize = max(uSize * sizeVariation * uPixelRatio * (2.0 / -mv.z), 1.5);
  vRandom = aRandom;
}
`;

const SPARKLE_FRAG = /* glsl */ `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying float vRandom;
void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  float strength = clamp(0.05 / d - 0.1, 0.0, 1.0);
  float colorMix = sin(vRandom * 6.28 + uTime) * 0.5 + 0.5;
  vec3 color = mix(uColor1, uColor2, colorMix);
  float twinkle = sin(uTime * 3.0 + vRandom * 20.0) * 0.3 + 0.7;
  gl_FragColor = vec4(color, strength * twinkle);
}
`;

const SEABED_VERT = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;
uniform float uNoiseScale;
uniform float uNoiseHeight;
uniform float uWaveSpeed;
uniform float uWaveAmplitude;
uniform float uScrollOffset;
attribute float aRandom;
varying float vHeight;
varying float vRandom;
varying float vFogDepth;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vec3 pos = position;
  float n = noise(vec2(pos.x, pos.z + uScrollOffset) * uNoiseScale);
  float wave = sin(pos.x * 0.3 + uTime * uWaveSpeed) *
               cos((pos.z + uScrollOffset) * 0.3 + uTime * uWaveSpeed) *
               uWaveAmplitude;
  float height = n * uNoiseHeight + wave;
  pos.y += height;
  vHeight = height;
  vRandom = aRandom;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vFogDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio * (1.0 / -mv.z) * (0.8 + aRandom * 0.4);
}
`;

const SEABED_FRAG = /* glsl */ `
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uGlowIntensity;
uniform float uTime;
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;
varying float vHeight;
varying float vRandom;
varying float vFogDepth;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float dist = length(c);
  if (dist > 0.5) discard;
  float alpha = pow(1.0 - smoothstep(0.0, 0.5, dist), 1.5);
  float h = clamp((vHeight + 4.0) / 10.0, 0.0, 1.0);
  vec3 color = mix(uColor1, uColor2, h);
  color = mix(color, uColor3, smoothstep(0.55, 1.0, h));
  float pulse = sin(uTime * 1.5 + vRandom * 6.28) * 0.3 + 0.7;
  color += uColor3 * smoothstep(0.7, 1.0, h) * pulse * uGlowIntensity * 0.35;
  float fog = smoothstep(uFogNear, uFogFar, vFogDepth);
  vec3 finalColor = mix(color, uFogColor, fog);
  gl_FragColor = vec4(finalColor, alpha * (0.75 + uGlowIntensity * 0.25) * (1.0 - fog * 0.65));
}
`;

const TUNNEL_VERT = /* glsl */ `
varying vec2 vUv;
varying float vFogDepth;
void main() {
  vUv = uv;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vFogDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

const TUNNEL_FRAG = /* glsl */ `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;
varying vec2 vUv;
varying float vFogDepth;

float caustics(vec2 uv, float time) {
  vec2 p = uv * 8.0;
  float c = 0.0;
  c += sin(p.x * 2.0 - time * 1.5 + sin(p.y * 3.0 - time * 0.8));
  c += sin(p.y * 3.0 - time * 1.2 + sin(p.x * 2.5 - time * 0.5));
  c += sin((p.x + p.y) * 1.5 - time);
  return c * 0.25 + 0.5;
}

void main() {
  vec2 uv = vUv;
  float wave1 = sin(uv.x * 10.0 - uTime * 0.8) * 0.02;
  float wave2 = cos(uv.y * 8.0 - uTime * 0.6) * 0.02;
  vec2 dUv = uv + vec2(wave1, wave2);
  float dist = length(dUv - 0.5);
  float pattern = caustics(dUv, uTime) * 0.6 + (sin(dist * 15.0 + uTime * 1.5) * 0.5 + 0.5) * 0.2;
  vec3 color = mix(uColor1, uColor2, pattern);
  color = mix(color, uColor3, pow(caustics(dUv, uTime), 2.0) * 0.5);
  color = mix(color * 0.35, color, smoothstep(0.0, 1.0, vUv.y));
  color += uColor3 * (1.0 - smoothstep(0.0, 0.5, dist)) * 0.3;
  color *= 1.0 - smoothstep(0.4, 0.5, dist) * 0.5;
  float fade = smoothstep(0.0, 0.12, vUv.y) * smoothstep(1.0, 0.88, vUv.y);
  float shimmer = sin(-uTime * 3.0 + dist * 20.0) * 0.1 + 0.9;
  float fog = smoothstep(fogNear, fogFar, vFogDepth);
  vec3 finalColor = mix(color * shimmer, fogColor, fog);
  gl_FragColor = vec4(finalColor, 0.55 * fade);
}
`;

function AnimatedDolphin() {
  const group = useRef<Group>(null);
  const sparklesRef = useRef<Points>(null);
  const linesRef = useRef<LineSegments>(null);
  const skinnedRef = useRef<SkinnedMesh | null>(null);
  const sampledRef = useRef<
    { vertexIndex: number; offset: THREE.Vector3; normal: THREE.Vector3; random: number; size: number }[]
  >([]);
  const tmp = useMemo(
    () => ({
      base: new THREE.Vector3(),
      skinned: new THREE.Vector3(),
      local: new THREE.Vector3(),
      normal: new THREE.Vector3(),
      colorA: new THREE.Color(0x327fe2),
      colorB: new THREE.Color(0x719bf8),
    }),
    [],
  );

  const { scene, animations } = useGLTF("/models/dolphin_anim.glb");

  const dolphinMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: DOLPHIN_VERT,
        fragmentShader: DOLPHIN_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms: {
          uBaseColor: { value: new THREE.Color(0x6fd3fb) },
        },
      }),
    [],
  );

  const model = useMemo(() => {
    const clone = SkeletonUtils.clone(scene);
    clone.traverse((child) => {
      const mesh = child as SkinnedMesh;
      if (!mesh.isMesh) return;
      mesh.frustumCulled = false;
      mesh.material = dolphinMat;
      if (mesh.isSkinnedMesh) skinnedRef.current = mesh;
    });
    return clone;
  }, [scene, dolphinMat]);

  const sparkleData = useMemo(() => {
    const mesh = skinnedRef.current;
    if (!mesh) return null;

    const sampler = new MeshSurfaceSampler(mesh).setWeightAttribute(null).build();
    const count = 900;
    const sampled: typeof sampledRef.current = [];
    const tempPos = new THREE.Vector3();
    const tempNormal = new THREE.Vector3();
    const posAttr = mesh.geometry.getAttribute("position");
    const search = new THREE.Vector3();

    for (let i = 0; i < count; i += 1) {
      sampler.sample(tempPos, tempNormal);
      let closest = 0;
      let best = Infinity;
      for (let v = 0; v < posAttr.count; v += 8) {
        search.fromBufferAttribute(posAttr, v);
        const d = search.distanceToSquared(tempPos);
        if (d < best) {
          best = d;
          closest = v;
        }
      }
      sampled.push({
        vertexIndex: closest,
        offset: tempPos.clone().sub(search.fromBufferAttribute(posAttr, closest)),
        normal: tempNormal.clone(),
        random: Math.random(),
        size: Math.random() * 0.5 + 0.5,
      });
    }
    sampledRef.current = sampled;

    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      randoms[i] = sampled[i].random;
      sizes[i] = sampled[i].size;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: SPARKLE_VERT,
      fragmentShader: SPARKLE_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 28 },
        uColor1: { value: new THREE.Color(0x327fe2) },
        uColor2: { value: new THREE.Color(0x91cdff) },
        uPixelRatio: { value: Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2) },
      },
    });

    const maxConnections = count * 4;
    const linePositions = new Float32Array(maxConnections * 6);
    const lineColors = new Float32Array(maxConnections * 6);
    const linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    linesGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));
    linesGeometry.setDrawRange(0, 0);

    return { geometry, material, linesGeometry, linePositions, lineColors, count };
  }, [model]);

  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    const clipName = Object.keys(actions)[0];
    const action = clipName ? actions[clipName] : null;
    if (!action) return;

    const clip = action.getClip();
    clip.tracks = clip.tracks.filter((track) => {
      const name = track.name.toLowerCase();
      return !(
        name.endsWith(".position") &&
        (name.includes("root") || name.includes("hips") || name.includes("maneroot"))
      );
    });

    action.reset();
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.setEffectiveTimeScale(1.1);
    action.fadeIn(0.35).play();
    return () => {
      action.fadeOut(0.15);
    };
  }, [actions]);

  useFrame(({ clock }, delta) => {
    mixer?.update(delta);
    const t = clock.elapsedTime;
    if (sparkleData?.material.uniforms.uTime) {
      sparkleData.material.uniforms.uTime.value = t;
    }

    const mesh = skinnedRef.current;
    const sparkles = sparklesRef.current;
    const lines = linesRef.current;
    const sampled = sampledRef.current;
    if (!mesh || !sparkles || !sparkleData || !sampled.length) return;

    mesh.skeleton?.update();
    mesh.updateMatrixWorld(true);

    const posAttr = sparkles.geometry.getAttribute("position") as THREE.BufferAttribute;
    const geoPos = mesh.geometry.getAttribute("position");
    const connectionDist = 0.16;
    const connectionDistSq = connectionDist * connectionDist;
    let lineCount = 0;

    for (let i = 0; i < sampled.length; i += 1) {
      const sample = sampled[i];
      tmp.base.fromBufferAttribute(geoPos, sample.vertexIndex);
      tmp.normal.copy(sample.normal).normalize();
      tmp.local.copy(tmp.base).addScaledVector(tmp.normal, 0.017);

      if (typeof (mesh as SkinnedMesh & { applyBoneTransform?: Function }).applyBoneTransform === "function") {
        tmp.skinned.copy(tmp.local);
        (mesh as SkinnedMesh & { applyBoneTransform: Function }).applyBoneTransform(
          sample.vertexIndex,
          tmp.skinned,
        );
        tmp.skinned.applyMatrix4(mesh.matrixWorld);
      } else if (typeof mesh.getVertexPosition === "function") {
        mesh.getVertexPosition(sample.vertexIndex, tmp.skinned);
        tmp.skinned.addScaledVector(tmp.normal, 0.017);
        mesh.localToWorld(tmp.skinned);
      } else {
        tmp.skinned.copy(tmp.local).applyMatrix4(mesh.matrixWorld);
      }

      posAttr.setXYZ(i, tmp.skinned.x, tmp.skinned.y, tmp.skinned.z);
    }
    posAttr.needsUpdate = true;

    // sparse connection lines
    if (lines) {
      const lp = sparkleData.linePositions;
      const lc = sparkleData.lineColors;
      for (let i = 0; i < sampled.length; i += 3) {
        const ax = posAttr.getX(i);
        const ay = posAttr.getY(i);
        const az = posAttr.getZ(i);
        for (let j = i + 1; j < Math.min(i + 18, sampled.length); j += 1) {
          const bx = posAttr.getX(j);
          const by = posAttr.getY(j);
          const bz = posAttr.getZ(j);
          const dx = ax - bx;
          const dy = ay - by;
          const dz = az - bz;
          const d2 = dx * dx + dy * dy + dz * dz;
          if (d2 > connectionDistSq || lineCount >= sparkleData.count * 3) continue;
          const idx = lineCount * 6;
          lp[idx] = ax;
          lp[idx + 1] = ay;
          lp[idx + 2] = az;
          lp[idx + 3] = bx;
          lp[idx + 4] = by;
          lp[idx + 5] = bz;
          const mix = 0.4 + Math.random() * 0.6;
          tmp.colorA.set(0x327fe2);
          tmp.colorB.set(0x91cdff);
          const col = tmp.colorA.lerp(tmp.colorB, mix);
          lc[idx] = col.r;
          lc[idx + 1] = col.g;
          lc[idx + 2] = col.b;
          lc[idx + 3] = col.r;
          lc[idx + 4] = col.g;
          lc[idx + 5] = col.b;
          lineCount += 1;
        }
      }
      lines.geometry.setDrawRange(0, lineCount * 2);
      lines.geometry.attributes.position.needsUpdate = true;
      lines.geometry.attributes.color.needsUpdate = true;
    }
  });

  return (
    <group ref={group} position={[0, 0.35, 0]} rotation={[0, Math.PI * 0.2, 0]} scale={1.65}>
      <primitive object={model} />
      {sparkleData && (
        <>
          <points ref={sparklesRef} geometry={sparkleData.geometry} material={sparkleData.material} frustumCulled={false} />
          <lineSegments
            ref={linesRef}
            geometry={sparkleData.linesGeometry}
            frustumCulled={false}
          >
            <lineBasicMaterial
              vertexColors
              transparent
              opacity={0.55}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </lineSegments>
        </>
      )}
    </group>
  );
}

function Seabed() {
  const count = 45000;

  const { positions, randoms } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 1] = -10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 90;
      randoms[i] = Math.random();
    }
    return { positions, randoms };
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: SEABED_VERT,
        fragmentShader: SEABED_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2) },
          uSize: { value: 90 },
          uNoiseScale: { value: 0.07 },
          uNoiseHeight: { value: 4.5 },
          uWaveSpeed: { value: 0.12 },
          uWaveAmplitude: { value: 1.0 },
          uScrollOffset: { value: 0 },
          uColor1: { value: new THREE.Color(0x0a4d6e) },
          uColor2: { value: new THREE.Color(0x1a7fa8) },
          uColor3: { value: new THREE.Color(0x2eb8e6) },
          uGlowIntensity: { value: 0.55 },
          uFogColor: { value: new THREE.Color(0x050816) },
          uFogNear: { value: 25 },
          uFogFar: { value: 85 },
        },
      }),
    [],
  );

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uScrollOffset.value = clock.elapsedTime * 2.8;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[randoms, 1]} />
      </bufferGeometry>
      <primitive object={material} attach="material" />
    </points>
  );
}

function WormholeTunnel() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: TUNNEL_VERT,
        fragmentShader: TUNNEL_FRAG,
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uColor1: { value: new THREE.Color(0x001235) },
          uColor2: { value: new THREE.Color(0x0a4d6e) },
          uColor3: { value: new THREE.Color(0x2eb8e6) },
          fogColor: { value: new THREE.Color(0x050816) },
          fogNear: { value: 20 },
          fogFar: { value: 120 },
        },
      }),
    [],
  );

  useFrame(({ clock }) => {
    mat.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 1.5, -20]}>
      <cylinderGeometry args={[22, 30, 140, 48, 1, true]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

function SpeedLines() {
  const group = useRef<Group>(null);
  const lines = useMemo(() => {
    return Array.from({ length: 70 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 8 + Math.random() * 18;
      return {
        x: Math.cos(angle) * radius,
        y: (Math.random() - 0.4) * 10,
        z: -40 + Math.random() * 80,
        speed: 8 + Math.random() * 14,
        len: 1.2 + Math.random() * 2.5,
        color: [0x00ffff, 0x00a1ff, 0x91cdff][Math.floor(Math.random() * 3)],
      };
    });
  }, []);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      const cfg = lines[i];
      child.position.z += cfg.speed * delta;
      if (child.position.z > 35) child.position.z = -55;
    });
  });

  return (
    <group ref={group}>
      {lines.map((line, i) => (
        <mesh key={i} position={[line.x, line.y, line.z]}>
          <boxGeometry args={[0.025, 0.025, line.len]} />
          <meshBasicMaterial color={line.color} transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function OceanDust() {
  const ref = useRef<Points>(null);
  const count = 1200;
  const positions = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      data[i * 3] = (Math.random() - 0.5) * 40;
      data[i * 3 + 1] = (Math.random() - 0.5) * 20;
      data[i * 3 + 2] = (Math.random() - 0.5) * 40;
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
      <pointsMaterial
        color="#67e8f9"
        size={0.035}
        transparent
        opacity={0.45}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#001235"]} />
      <fog attach="fog" args={["#050816", 22, 95]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[5, 4, 6]} color="#67e8f9" intensity={1.6} />
      <pointLight position={[-6, 1, -4]} color="#818cf8" intensity={1.1} />
      <Stars radius={80} depth={50} count={2200} factor={2.8} saturation={0} fade speed={0.35} />
      <WormholeTunnel />
      <Seabed />
      <SpeedLines />
      <OceanDust />
      <Suspense fallback={null}>
        <AnimatedDolphin />
      </Suspense>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom
        enableRotate
        minDistance={3.5}
        maxDistance={14}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.65}
        zoomSpeed={0.45}
        maxPolarAngle={Math.PI * 0.78}
        minPolarAngle={Math.PI * 0.25}
        target={[0, 0.3, 0]}
      />
    </>
  );
}

export default function CyberOceanBackground() {
  return (
    <div className="cyber-ocean-bg" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0.8, 1.8, 7.2], fov: 45 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
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
