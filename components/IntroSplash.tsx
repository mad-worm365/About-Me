"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "madworm-intro-seen";

export function IntroSplash() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const dismissed = useRef(false);

  const dismiss = () => {
    if (dismissed.current) return;
    dismissed.current = true;
    setLeaving(true);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    window.setTimeout(() => setVisible(false), 450);
  };

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") {
        setVisible(false);
        return;
      }
    } catch {
      // ignore
    }

    setVisible(true);

    // Auto-open main page when the 3s dial finishes
    const timer = window.setTimeout(() => {
      dismiss();
    }, 3000);

    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#050816] transition-opacity duration-450 pointer-events-auto ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome"
    >
      <div className="flex w-full max-w-md flex-col items-center px-6">
        <div className="relative grid h-64 w-64 place-items-center sm:h-72 sm:w-72">
          <div
            className="absolute inset-0 will-change-transform"
            style={{
              animation: "intro-dial-spin 3s cubic-bezier(0.22, 1, 0.36, 1) forwards",
            }}
          >
            <DialRing />
          </div>

          <div className="pointer-events-none absolute inset-0">
            <span className="absolute top-1 left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-[0.2em] text-cyan-300/90">
              100
            </span>
            <span className="absolute top-1/2 right-1 -translate-y-1/2 font-mono text-[11px] tracking-[0.2em] text-cyan-300/90">
              25
            </span>
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-[0.2em] text-cyan-300/90">
              50
            </span>
            <span className="absolute top-1/2 left-1 -translate-y-1/2 font-mono text-[11px] tracking-[0.2em] text-cyan-300/90">
              75
            </span>
          </div>

          <p className="relative z-10 max-w-[7.5rem] text-center font-mono text-[11px] leading-4 tracking-[0.18em] text-cyan-200 uppercase sm:text-xs">
            Connection
            <br />
            Established
          </p>
        </div>

        <button
          type="button"
          onClick={dismiss}
          className="mt-10 inline-flex min-w-[260px] items-center justify-center gap-2 border border-cyan-400/80 bg-[#0a1630]/80 px-8 py-3 font-mono text-[12px] tracking-[0.22em] text-cyan-200 uppercase transition [clip-path:polygon(12px_0,100%_0,calc(100%-12px)_100%,0_100%)] hover:bg-cyan-400/10 hover:text-white sm:min-w-[300px] sm:text-[13px]"
        >
          Learn more about me
        </button>

        <button
          type="button"
          onClick={dismiss}
          className="mt-4 font-mono text-[11px] tracking-[0.16em] text-slate-400 transition hover:text-cyan-200"
        >
          or continue without sound
        </button>
      </div>
    </div>
  );
}

function DialRing() {
  const ticks = Array.from({ length: 72 }, (_, index) => index);

  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
      <defs>
        <filter id="intro-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#intro-glow)" stroke="#67E8F9" strokeLinecap="round">
        {ticks.map((tick) => {
          const angle = (tick / ticks.length) * Math.PI * 2;
          const major = tick % 6 === 0;
          const inner = major ? 78 : 84;
          const outer = 92;
          const x1 = 100 + Math.cos(angle) * inner;
          const y1 = 100 + Math.sin(angle) * inner;
          const x2 = 100 + Math.cos(angle) * outer;
          const y2 = 100 + Math.sin(angle) * outer;
          return (
            <line
              key={tick}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              strokeWidth={major ? 1.8 : 1}
              opacity={major ? 0.95 : 0.45}
            />
          );
        })}
      </g>
    </svg>
  );
}
