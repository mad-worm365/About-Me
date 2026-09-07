"use client";

import { useEffect, useRef, useState } from "react";

type Spark = { id: number; x: number; y: number };

export function CursorBuddy() {
  const buddyRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 80, y: 80 });
  const pos = useRef({ x: 80, y: 80 });
  const vel = useRef({ x: 0, y: 0 });
  const lastScroll = useRef(0);
  const scrollBoost = useRef(0);
  const [sparkles, setSparkles] = useState<Spark[]>([]);
  const [mood, setMood] = useState<"idle" | "down" | "up">("idle");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduceMotion) return;
    setEnabled(true);

    lastScroll.current = window.scrollY;
    let sparkId = 0;
    let ticks = 0;
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      target.current = { x: event.clientX, y: event.clientY };
    };

    const onScroll = () => {
      const next = window.scrollY;
      const delta = next - lastScroll.current;
      lastScroll.current = next;
      scrollBoost.current = Math.max(-18, Math.min(18, delta));
      setMood(delta > 2 ? "down" : delta < -2 ? "up" : "idle");
    };

    const onClick = (event: MouseEvent) => {
      const node = buddyRef.current;
      if (!node) return;
      node.animate(
        [
          { transform: node.style.transform },
          { transform: `${node.style.transform} scale(1.25)` },
          { transform: node.style.transform },
        ],
        { duration: 280, easing: "ease-out" },
      );
      setSparkles((current) => [
        ...current.slice(-8),
        { id: ++sparkId, x: event.clientX, y: event.clientY },
      ]);
    };

    const tick = () => {
      const pull = 0.14;
      vel.current.x += (target.current.x - pos.current.x) * pull;
      vel.current.y += (target.current.y - pos.current.y) * pull;
      vel.current.x *= 0.78;
      vel.current.y *= 0.78;
      pos.current.x += vel.current.x;
      pos.current.y += vel.current.y;
      scrollBoost.current *= 0.9;

      const speed = Math.hypot(vel.current.x, vel.current.y);
      const angle = Math.atan2(vel.current.y, vel.current.x) * (180 / Math.PI);
      const lean = scrollBoost.current * 1.8;
      const stretch = 1 + Math.min(0.18, speed / 40);

      if (buddyRef.current) {
        buddyRef.current.style.transform = `translate3d(${pos.current.x - 22}px, ${pos.current.y - 22}px, 0) rotate(${angle + lean}deg) scale(${stretch})`;
      }

      ticks += 1;
      if (speed > 3.2 && ticks % 5 === 0) {
        setSparkles((current) => [
          ...current.slice(-10),
          { id: ++sparkId, x: pos.current.x, y: pos.current.y },
        ]);
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    if (sparkles.length === 0) return;
    const timer = window.setTimeout(() => {
      setSparkles((current) => current.slice(1));
    }, 280);
    return () => window.clearTimeout(timer);
  }, [sparkles]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[80] hidden md:block" aria-hidden>
      {sparkles.map((spark) => (
        <span
          key={spark.id}
          className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-400/80 shadow-[0_0_10px_rgba(139,92,246,0.7)]"
          style={{ left: spark.x, top: spark.y }}
        />
      ))}
      <div ref={buddyRef} className="absolute top-0 left-0 will-change-transform">
        <Robot mood={mood} />
      </div>
    </div>
  );
}

function Robot({ mood }: { mood: "idle" | "down" | "up" }) {
  return (
    <div className="relative">
      <svg viewBox="0 0 64 64" className="h-11 w-11 drop-shadow-lg" fill="none">
        <rect x="18" y="20" width="28" height="24" rx="8" fill="#8B5CF6" />
        <rect x="22" y="24" width="20" height="12" rx="6" fill="#1E1B4B" />
        <circle cx="28" cy="30" r="2.4" fill="#67E8F9" />
        <circle cx="36" cy="30" r="2.4" fill="#67E8F9" />
        <rect x="26" y="38" width="12" height="3" rx="1.5" fill="#C4B5FD" />
        <circle cx="32" cy="14" r="3" fill="#A78BFA" />
        <path d="M32 17v3" stroke="#A78BFA" strokeWidth="2" />
        <rect x="14" y="28" width="5" height="10" rx="2" fill="#7C3AED" />
        <rect x="45" y="28" width="5" height="10" rx="2" fill="#7C3AED" />
        <path d="M24 44 22 54" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" />
        <path d="M40 44 42 54" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {mood !== "idle" && (
        <span className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-violet-600 shadow-sm dark:bg-surface dark:text-violet-200">
          {mood === "down" ? "weee!" : "whoa!"}
        </span>
      )}
    </div>
  );
}
