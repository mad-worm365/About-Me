"use client";

import { useEffect, useRef, useState } from "react";

type Particle = {
  id: number;
  x: number;
  y: number;
  angle: number;
  dist: number;
  size: number;
  kind: "ray" | "dot" | "speck";
  delay: number;
  hue: "white" | "ice";
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

  // 4 cardinal rays (cross) — matches the GIF's main streaks
  for (let i = 0; i < 4; i += 1) {
    const angle = (i * Math.PI) / 2 + (Math.random() - 0.5) * 0.12;
    particles.push({
      id: pid++,
      x,
      y,
      angle,
      dist: 28 + Math.random() * 14,
      size: 2.2 + Math.random() * 1.4,
      kind: "ray",
      delay: 0,
      hue: "white",
    });
  }

  // Expanding ring of dots
  const ringCount = 10;
  for (let i = 0; i < ringCount; i += 1) {
    const angle = (i / ringCount) * Math.PI * 2 + Math.random() * 0.2;
    particles.push({
      id: pid++,
      x,
      y,
      angle,
      dist: 14 + Math.random() * 10,
      size: 1.4 + Math.random() * 1.6,
      kind: "dot",
      delay: Math.random() * 40,
      hue: Math.random() > 0.65 ? "ice" : "white",
    });
  }

  // Outer scatter / diagonal flecks
  for (let i = 0; i < 8; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    particles.push({
      id: pid++,
      x,
      y,
      angle,
      dist: 22 + Math.random() * 26,
      size: 1 + Math.random() * 2.2,
      kind: "speck",
      delay: 20 + Math.random() * 60,
      hue: Math.random() > 0.5 ? "ice" : "white",
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
      // Skip text fields so caret still feels normal
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;

      const burst = makeBurst(event.clientX, event.clientY);
      setBursts((current) => [...current.slice(-4), burst]);

      const timer = window.setTimeout(() => {
        setBursts((current) => current.filter((b) => b.id !== burst.id));
      }, 520);
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
          {burst.particles.map((p) => (
            <i
              key={p.id}
              className={`click-spark-particle click-spark-${p.kind} click-spark-${p.hue}`}
              style={{
                left: burst.x,
                top: burst.y,
                width: p.size,
                height: p.kind === "ray" ? p.size * 3.2 : p.size,
                ["--spark-angle" as string]: `${p.angle}rad`,
                ["--spark-dist" as string]: `${p.dist}px`,
                animationDelay: `${p.delay}ms`,
              }}
            />
          ))}
        </span>
      ))}
    </div>
  );
}
