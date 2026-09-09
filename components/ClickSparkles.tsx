"use client";

import { useEffect, useRef, useState } from "react";

type Particle = {
  id: number;
  dx: number;
  dy: number;
  size: number;
  kind: "star" | "dot" | "speck";
  delay: number;
  hue: "white" | "ice";
  spin: number;
};

type Burst = {
  id: number;
  x: number;
  y: number;
  particles: Particle[];
};

let nextId = 0;

function makeBurst(x: number, y: number): Burst {
  const particles: Particle[] = [];
  let pid = 0;

  // Several 4-point sparks, each in a fully random direction
  const starCount = 5 + Math.floor(Math.random() * 3);
  for (let i = 0; i < starCount; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 24 + Math.random() * 36;
    particles.push({
      id: pid++,
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist,
      size: 14 + Math.random() * 10,
      kind: "star",
      delay: Math.random() * 50,
      hue: Math.random() > 0.7 ? "ice" : "white",
      spin: (Math.random() - 0.5) * 40,
    });
  }

  // Extra flecks also in random directions
  for (let i = 0; i < 10; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 12 + Math.random() * 34;
    particles.push({
      id: pid++,
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist,
      size: 1.2 + Math.random() * 2.4,
      kind: Math.random() > 0.45 ? "dot" : "speck",
      delay: Math.random() * 70,
      hue: Math.random() > 0.55 ? "ice" : "white",
      spin: 0,
    });
  }

  return { id: ++nextId, x, y, particles };
}

export function ClickSparkles() {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [enabled, setEnabled] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    setEnabled(true);

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;

      const burst = makeBurst(event.clientX, event.clientY);
      setBursts((current) => [...current.slice(-4), burst]);

      const timer = window.setTimeout(() => {
        setBursts((current) => current.filter((b) => b.id !== burst.id));
      }, 560);
      timers.current.push(timer);
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      timers.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-90" aria-hidden>
      {bursts.map((burst) => (
        <span key={burst.id} className="absolute inset-0">
          {burst.particles.map((p) =>
            p.kind === "star" ? (
              <span
                key={p.id}
                className={`click-spark-particle click-spark-star click-spark-${p.hue}`}
                style={{
                  left: burst.x,
                  top: burst.y,
                  width: p.size,
                  height: p.size,
                  ["--spark-dx" as string]: `${p.dx}px`,
                  ["--spark-dy" as string]: `${p.dy}px`,
                  ["--spark-spin" as string]: `${p.spin}deg`,
                  animationDelay: `${p.delay}ms`,
                }}
              >
                <SparkIcon />
              </span>
            ) : (
              <i
                key={p.id}
                className={`click-spark-particle click-spark-${p.kind} click-spark-${p.hue}`}
                style={{
                  left: burst.x,
                  top: burst.y,
                  width: p.size,
                  height: p.size,
                  ["--spark-dx" as string]: `${p.dx}px`,
                  ["--spark-dy" as string]: `${p.dy}px`,
                  ["--spark-spin" as string]: "0deg",
                  animationDelay: `${p.delay}ms`,
                }}
              />
            ),
          )}
        </span>
      ))}
    </div>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" fill="currentColor" aria-hidden>
      <path d="M32 4 34.2 26.5 52 20 37.5 32 52 44 34.2 37.5 32 60 29.8 37.5 12 44 26.5 32 12 20 29.8 26.5Z" />
      <circle cx="32" cy="32" r="5.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
    </svg>
  );
}
