"use client";

import { useEffect, useRef, useState } from "react";

type ClickBurst = {
  id: number;
  x: number;
  y: number;
};

export function CursorBuddy() {
  const tipRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });
  const [clicking, setClicking] = useState(false);
  const [bursts, setBursts] = useState<ClickBurst[]>([]);
  const [enabled, setEnabled] = useState(false);
  const clickTimer = useRef<number | null>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduceMotion) return;
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor");

    let burstId = 0;
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      target.current = { x: event.clientX, y: event.clientY };
    };

    const onClick = (event: MouseEvent) => {
      const id = ++burstId;
      setClicking(true);
      setBursts((current) => [...current.slice(-3), { id, x: event.clientX, y: event.clientY }]);

      if (clickTimer.current) window.clearTimeout(clickTimer.current);
      clickTimer.current = window.setTimeout(() => setClicking(false), 1000);

      window.setTimeout(() => {
        setBursts((current) => current.filter((burst) => burst.id !== id));
      }, 1000);
    };

    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.32;
      pos.current.y += (target.current.y - pos.current.y) * 0.32;

      if (tipRef.current) {
        tipRef.current.style.transform = `translate3d(${pos.current.x - 10}px, ${pos.current.y - 4}px, 0)`;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("click", onClick);
      document.documentElement.classList.remove("custom-cursor");
      if (clickTimer.current) window.clearTimeout(clickTimer.current);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-80 hidden md:block" aria-hidden>
      <div ref={tipRef} className="absolute top-0 left-0 will-change-transform">
        {clicking ? <HandTap /> : <HandIdle />}
      </div>

      {bursts.map((burst) => (
        <span
          key={burst.id}
          className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 animate-[click-particle_1s_ease-out_forwards] rounded-full bg-white/90"
          style={{ left: burst.x, top: burst.y }}
        />
      ))}
    </div>
  );
}

function HandIdle() {
  return (
    <svg viewBox="0 0 64 72" className="h-12 w-11 drop-shadow-md" fill="none">
      <path
        d="M28 6c-3.2 0-5.6 2.6-5.6 5.8V34l-4.2-3.4a4.4 4.4 0 0 0-6.4.4 4.3 4.3 0 0 0 .5 6.1l9.7 8.2c1.6 1.4 3.7 2.1 5.8 2.1H40c5.2 0 9.4-4 9.4-9V20.4c0-3-2.4-5.4-5.4-5.4-1 0-1.9.2-2.7.7V11.8c0-3.2-2.4-5.8-5.6-5.8-1.1 0-2.1.3-3 .8V11.8c0-3.2-2.5-5.8-5.7-5.8Z"
        fill="white"
        stroke="#E07A3A"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <circle cx="22" cy="58" r="1.4" fill="white" opacity="0.9" />
      <circle cx="30" cy="62" r="1.1" fill="white" opacity="0.75" />
      <circle cx="38" cy="58" r="1.2" fill="white" opacity="0.8" />
    </svg>
  );
}

function HandTap() {
  return (
    <svg
      viewBox="0 0 72 72"
      className="h-14 w-14 animate-[hand-tap_1s_ease-out_forwards] drop-shadow-md"
      fill="none"
    >
      <path
        d="M18 10c6-4 12-1 14 4"
        stroke="#E07A3A"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M24 6c5-2 10 0 12 4"
        stroke="#E07A3A"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M34 10c-3.4 0-6 2.8-6 6.2V36.5l-5-4.2a4.6 4.6 0 0 0-6.7.5 4.5 4.5 0 0 0 .6 6.4l11.2 9.4c1.8 1.5 4.1 2.3 6.5 2.3H48c5.5 0 10-4.3 10-9.6V24.8c0-3.2-2.6-5.8-5.8-5.8-1 0-2 .3-2.8.8v-3.6c0-3.4-2.6-6.2-6-6.2-1.2 0-2.3.3-3.2.9V16.2c0-3.4-2.6-6.2-6.2-6.2Z"
        fill="white"
        stroke="#E07A3A"
        strokeWidth="3.2"
        strokeLinejoin="round"
        transform="rotate(28 36 36)"
      />
      <path
        d="M48 52 52 44 60 48 54 54 58 62 48 56 40 62 44 54 36 50 44 48Z"
        fill="white"
        stroke="#E07A3A"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
