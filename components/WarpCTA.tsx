"use client";

import { useEffect, useRef } from "react";

type StarColor = { r: number; g: number; b: number; a: number };

type Star = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseOpacity: number;
  size: number;
  age: number;
  maxAge: number;
  fadeIn: number;
  color: StarColor;
};

const COUNT = 300;
const SPEED = 2;
const THICKNESS = 2;
const OPACITY = 0.5;
const LENGTH = 20;
const CENTER_THINNING = 0.5;
const CENTER_SHORTENING = 0.5;
const COLORS: StarColor[] = [
  { r: 255, g: 255, b: 255, a: 0.9 },
  { r: 255, g: 255, b: 255, a: 0.9 },
  { r: 64, g: 134, b: 255, a: 0.85 },
  { r: 81, g: 86, b: 90, a: 0.6 },
];

export function WarpCTA() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let stars: Star[] = [];
    let lastTime = 0;
    let animId = 0;

    const getRadii = () => {
      const shortest = Math.min(W, H);
      return {
        inner: shortest * 0.28,
        outer: shortest * 1.4,
      };
    };

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };

    const spawnStar = (): Star => {
      const r = getRadii();
      const cx = W / 2;
      const cy = H / 2;
      const angle = Math.random() * Math.PI * 2;
      const dist = r.outer * (0.85 + Math.random() * 0.3);
      const sx = cx + Math.cos(angle) * dist;
      const sy = cy + Math.sin(angle) * dist;
      const dx = cx - sx;
      const dy = cy - sy;
      const d = Math.sqrt(dx * dx + dy * dy);
      const spd = SPEED * (0.06 + Math.random() * 0.06);
      const col = COLORS[Math.floor(Math.random() * COLORS.length)];
      return {
        x: sx,
        y: sy,
        vx: (dx / d) * spd,
        vy: (dy / d) * spd,
        baseOpacity: OPACITY * (0.5 + Math.random() * 0.5) * col.a,
        size: THICKNESS * (0.4 + Math.random() * 1.4),
        age: 0,
        maxAge: 90 + Math.random() * 60,
        fadeIn: 0,
        color: col,
      };
    };

    const initStars = () => {
      stars = [];
      for (let i = 0; i < COUNT; i += 1) {
        const s = spawnStar();
        const t = Math.random();
        s.age = t * s.maxAge * 0.8;
        s.fadeIn = 0.4 + Math.random() * 0.6;
        s.x += s.vx * s.age * 55;
        s.y += s.vy * s.age * 55;
        stars.push(s);
      }
    };

    const frame = (timestamp: number) => {
      const dt = Math.min(timestamp - lastTime, 50);
      lastTime = timestamp;
      const r = getRadii();
      const cx = W / 2;
      const cy = H / 2;

      ctx.clearRect(0, 0, W, H);

      const dead: number[] = [];

      for (let i = 0; i < stars.length; i += 1) {
        const s = stars[i];
        s.age += dt * 0.04;
        s.x += s.vx * dt;
        s.y += s.vy * dt;

        const distFromCenter = Math.sqrt(
          (s.x - cx) * (s.x - cx) + (s.y - cy) * (s.y - cy),
        );

        if (s.age > s.maxAge || distFromCenter < r.inner * 0.65) {
          dead.push(i);
          continue;
        }

        s.fadeIn = Math.min(1, s.age / 20);
        const edgeRatio = Math.max(
          0,
          (distFromCenter - r.inner * 0.65) / (r.inner * 0.5),
        );
        const edgeFade = Math.min(1, edgeRatio);
        const alpha = s.baseOpacity * s.fadeIn * edgeFade;
        if (alpha < 0.01) continue;

        const distRatio = Math.max(
          0,
          Math.min(1, distFromCenter / (r.outer * 0.6)),
        );
        const thinning = 1 - CENTER_THINNING + distRatio * CENTER_THINNING;
        const lineW = Math.max(0.3, s.size * thinning);
        const shortening =
          1 - CENTER_SHORTENING + distRatio * CENTER_SHORTENING;
        const tailLen = Math.max(
          2,
          LENGTH * distRatio * shortening * (0.5 + distRatio * 0.5),
        );

        const spd = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
        if (spd < 0.0001) continue;
        const nx = s.vx / spd;
        const ny = s.vy / spd;

        const c = s.color;
        ctx.lineWidth = lineW;
        ctx.lineCap = "round";
        ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`;
        ctx.beginPath();
        ctx.moveTo(s.x - nx * tailLen, s.y - ny * tailLen);
        ctx.lineTo(s.x + nx * 2, s.y + ny * 2);
        ctx.stroke();
      }

      for (let j = dead.length - 1; j >= 0; j -= 1) stars.splice(dead[j], 1);

      const needed = COUNT - stars.length;
      const batch = Math.min(needed, Math.max(2, Math.ceil(needed * 0.05)));
      for (let k = 0; k < batch; k += 1) stars.push(spawnStar());

      animId = requestAnimationFrame(frame);
    };

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
        cancelAnimationFrame(animId);
        resize();
        initStars();
        lastTime = performance.now();
        animId = requestAnimationFrame(frame);
      }
    });

    ro.observe(canvas);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section className="cta-warp relative w-full overflow-hidden">
      <canvas ref={canvasRef} className="cta-warp-canvas" aria-hidden />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-5 py-14 text-center sm:px-8 sm:py-16 lg:py-20">
        <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Start Building
          <br />
          <span className="bg-linear-to-r from-sky-300 to-violet-300 bg-clip-text text-transparent">
            with Mad Worm today
          </span>
        </h2>
        <div className="mt-8">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-[1.03]"
          >
            Get In Touch
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              aria-hidden
            >
              <path
                d="M 4.697 14.125 L 5.875 15.303 L 12.946 8.232 L 14.125 9.411 L 15.303 8.232 L 14.125 7.054 L 15.303 5.875 L 14.125 4.697 L 12.946 5.875 L 11.768 4.697 L 10.589 5.875 L 11.768 7.054 Z M 8.232 5.875 L 9.411 4.697 L 10.589 5.875 L 9.411 7.054 Z M 8.232 5.875 L 7.054 7.054 L 5.875 5.875 L 7.054 4.697 Z M 14.125 11.768 L 15.303 10.589 L 14.125 9.411 L 12.946 10.589 Z M 14.125 11.768 L 12.946 12.946 L 14.125 14.125 L 15.303 12.946 Z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
