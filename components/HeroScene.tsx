import type { ReactNode } from "react";
import { VideoBackground } from "./VideoBackground";

export function HeroScene() {
  return (
    <div className="relative mx-auto h-[460px] w-full max-w-[520px] sm:h-[500px]">
      <VideoBackground />
      <div className="absolute left-[8%] top-[8%] h-72 w-72 rounded-full bg-violet-200/80 blur-3xl dark:bg-violet-500/20" />
      <div className="absolute right-[4%] top-[22%] h-56 w-56 rounded-full bg-sky-200/80 blur-3xl dark:bg-sky-500/15" />

      <svg
        className="pointer-events-none absolute left-[18%] top-[6%] h-16 w-20 text-violet-400"
        viewBox="0 0 80 60"
        fill="none"
      >
        <path
          d="M8 40c10-22 22-28 36-20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M52 12 56 22 66 18 58 26 62 36 52 28 42 34 48 24 40 16 52 20Z" fill="currentColor" />
      </svg>

      <CodeWindow />

      <div className="absolute left-0 top-[28%] z-20 animate-float-delayed">
        <AiChip />
      </div>

      <div className="absolute bottom-0 left-0 z-20 w-[260px] sm:w-[280px]">
        <WormAtLaptop />
      </div>

      <div className="absolute bottom-[64px] right-0 z-20 flex flex-col gap-2.5">
        <TechTile className="animate-float">
          <CloudIcon />
        </TechTile>
        <TechTile className="ml-5 animate-float-delayed">
          <DbIcon />
        </TechTile>
        <TechTile className="animate-float-slow">
          <NextIcon />
        </TechTile>
        <TechTile className="ml-4 animate-float">
          <ChartIcon />
        </TechTile>
      </div>

      <div className="absolute right-0 top-[42%] hidden w-16 sm:block">
        <p className="font-hand text-center text-[20px] leading-5 text-violet-500">
          Good code
          <br />
          Better Ideas
        </p>
        <Rocket className="mx-auto mt-2 h-7 w-7 animate-plane" />
      </div>

      <Star className="absolute right-[28%] top-[8%] h-3 w-3 text-violet-400" />
      <Star className="absolute bottom-[18%] left-[8%] h-2.5 w-2.5 text-sky-400" />
      <Star className="absolute right-[10%] bottom-[38%] h-3 w-3 text-fuchsia-400" />
    </div>
  );
}

function CodeWindow() {
  return (
    <div className="absolute left-0 top-0 z-20 w-[62%] max-w-[270px] animate-float-slow overflow-hidden rounded-2xl bg-[#1b2230] p-3 shadow-[0_22px_50px_-18px_rgba(15,23,42,0.55)] ring-1 ring-white/10">
      <div className="mb-2.5 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      </div>
      <pre className="font-mono text-[10.5px] leading-[1.55]">
        <Line n="1" />
        <span className="text-[#c084fc]">const</span> <span className="text-[#7dd3fc]">app</span>
        <span className="text-slate-300"> = </span>
        <span className="text-[#93c5fd]">express</span>
        <span className="text-slate-300">()</span>
        {"\n"}
        <Line n="2" />
        {"\n"}
        <Line n="3" />
        <span className="text-[#7dd3fc]">app</span>
        <span className="text-slate-300">.</span>
        <span className="text-[#93c5fd]">get</span>
        <span className="text-slate-300">(</span>
        <span className="text-[#86efac]">&apos;/ask&apos;</span>
        <span className="text-slate-300">, </span>
        <span className="text-[#c084fc]">async</span>
        <span className="text-slate-300"> (req, res) =&gt; {"{"}</span>
        {"\n"}
        <Line n="4" />
        <span className="text-[#c084fc]">  const</span> <span className="text-[#7dd3fc]">out</span>
        <span className="text-slate-300"> = </span>
        <span className="text-[#c084fc]">await</span> <span className="text-[#7dd3fc]">ai</span>
        <span className="text-slate-300">.</span>
        <span className="text-[#93c5fd]">generate</span>
        <span className="text-slate-300">({"{"}</span>
        {"\n"}
        <Line n="5" />
        <span className="text-[#fda4af]">    prompt</span>
        <span className="text-slate-300">: </span>
        <span className="text-[#86efac]">&apos;build something great&apos;</span>
        {"\n"}
        <Line n="6" />
        <span className="text-slate-300">  {"}"})</span>
        {"\n"}
        <Line n="7" />
        <span className="text-[#7dd3fc]">  res</span>
        <span className="text-slate-300">.</span>
        <span className="text-[#93c5fd]">json</span>
        <span className="text-slate-300">(out)</span>
        {"\n"}
        <Line n="8" />
        <span className="text-slate-300">{"}"}){"\n"}</span>
        <Line n="9" />
        {"\n"}
        <Line n="10" />
        <span className="text-[#7dd3fc]">console</span>
        <span className="text-slate-300">.</span>
        <span className="text-[#93c5fd]">log</span>
        <span className="text-slate-300">(</span>
        <span className="text-[#86efac]">&apos;AI + Full Stack 🚀&apos;</span>
        <span className="text-slate-300">)</span>
      </pre>
    </div>
  );
}

function Line({ n }: { n: string }) {
  return <span className="mr-2 inline-block w-3 text-right text-slate-500">{n}</span>;
}

function WormAtLaptop() {
  return (
    <svg viewBox="0 0 340 280" className="h-auto w-full" aria-hidden>
      <defs>
        <linearGradient id="hero-worm" x1="40" y1="20" x2="240" y2="220">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="45%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <linearGradient id="hero-shine" x1="90" y1="40" x2="150" y2="110">
          <stop offset="0%" stopColor="#F5F3FF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#F5F3FF" stopOpacity="0" />
        </linearGradient>
      </defs>

      <ellipse cx="168" cy="262" rx="92" ry="10" fill="#94A3B8" opacity="0.28" />

      <rect x="78" y="168" width="176" height="78" rx="16" fill="#1E293B" />
      <rect x="90" y="178" width="152" height="46" rx="10" fill="#0F172A" />
      <path d="M138 226h64l12 22H126l12-22Z" fill="#334155" />
      <text
        x="166"
        y="208"
        textAnchor="middle"
        fill="white"
        fontSize="22"
        fontWeight="700"
        fontFamily="ui-monospace, monospace"
      >
        {"</>"}
      </text>

      <ellipse cx="214" cy="176" rx="36" ry="24" fill="url(#hero-worm)" />
      <ellipse cx="176" cy="160" rx="34" ry="26" fill="url(#hero-worm)" />
      <ellipse cx="140" cy="142" rx="32" ry="28" fill="url(#hero-worm)" />
      <circle cx="118" cy="96" r="52" fill="url(#hero-worm)" />
      <ellipse cx="98" cy="76" rx="18" ry="11" fill="url(#hero-shine)" />

      <path d="M96 52c-10-26-4-40 10-44" stroke="#7C3AED" strokeWidth="7" strokeLinecap="round" />
      <path d="M136 48c8-28 24-38 36-32" stroke="#7C3AED" strokeWidth="7" strokeLinecap="round" />
      <circle cx="106" cy="10" r="8" fill="#DDD6FE" />
      <circle cx="174" cy="16" r="8" fill="#DDD6FE" />

      <circle cx="104" cy="94" r="13" fill="white" />
      <circle cx="136" cy="92" r="13" fill="white" />
      <circle cx="107" cy="96" r="6.5" fill="#0F172A" />
      <circle cx="139" cy="94" r="6.5" fill="#0F172A" />
      <circle cx="109" cy="94" r="2" fill="white" />
      <circle cx="141" cy="92" r="2" fill="white" />

      <ellipse cx="104" cy="94" rx="16" ry="13" stroke="#111827" strokeWidth="3.2" />
      <ellipse cx="136" cy="92" rx="16" ry="13" stroke="#111827" strokeWidth="3.2" />
      <path d="M120 93h4.5" stroke="#111827" strokeWidth="3" />

      <path d="M114 114c7 9 20 9 28 0" stroke="#4C1D95" strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="90" cy="108" r="5" fill="#F9A8D4" />
      <circle cx="152" cy="106" r="5" fill="#F9A8D4" />
    </svg>
  );
}

function TechTile({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`grid h-12 w-12 place-items-center rounded-2xl border border-white bg-white shadow-[0_10px_22px_rgba(15,23,42,0.12)] dark:border-line dark:bg-surface ${className}`}
    >
      {children}
    </div>
  );
}

function AiChip() {
  return (
    <div className="relative grid h-[88px] w-[88px] place-items-center rounded-3xl bg-white/70 shadow-[0_12px_28px_rgba(139,92,246,0.18)] backdrop-blur-md dark:bg-surface/80">
      <span className="absolute right-2 top-1.5 text-[10px] text-emerald-400">✦</span>
      <svg viewBox="0 0 88 88" className="h-[78px] w-[78px]" aria-hidden>
        <defs>
          <linearGradient id="ai-chip-core" x1="28" y1="24" x2="60" y2="64">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        <rect x="24" y="24" width="40" height="40" rx="10" fill="white" />
        <rect x="28" y="28" width="32" height="32" rx="8" fill="url(#ai-chip-core)" />
        <path
          d="M31 31h4M53 31h4M31 57h4M53 57h4"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.85"
        />
        <text
          x="44"
          y="49"
          textAnchor="middle"
          fill="white"
          fontSize="13"
          fontWeight="800"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          AI
        </text>
        <g stroke="#7C8CFF" strokeWidth="1.7" fill="none" strokeLinecap="round">
          <path d="M32 24V14" />
          <path d="M44 24V12" />
          <path d="M56 24V14" />
          <circle cx="32" cy="12" r="2.1" fill="#7C8CFF" />
          <circle cx="56" cy="12" r="2.1" fill="none" />
          <path d="M24 32H14" />
          <path d="M24 44H12" />
          <path d="M24 56H14" />
          <circle cx="12" cy="32" r="2.1" fill="#7C8CFF" />
          <circle cx="12" cy="44" r="2.1" fill="#7C8CFF" />
          <circle cx="12" cy="56" r="2.1" fill="#7C8CFF" />
          <path d="M64 32H74" />
          <path d="M64 44H76" />
          <path d="M64 56H74" />
          <circle cx="76" cy="32" r="2.1" fill="#7C8CFF" />
          <path d="M74 42l4 2-4 2" fill="#7C8CFF" stroke="none" />
          <circle cx="76" cy="56" r="2.1" fill="#7C8CFF" />
          <path d="M32 64V74" />
          <path d="M56 64V74" />
          <circle cx="32" cy="76" r="2.1" fill="#7C8CFF" />
          <circle cx="56" cy="76" r="2.1" fill="#7C8CFF" />
          <path d="M44 64v4l-3 3 3 3 3-3-3-3v1" />
        </g>
      </svg>
    </div>
  );
}

function CloudIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="#8B5CF6" aria-hidden>
      <path d="M7 18h10a4 4 0 0 0 .6-8 5.2 5.2 0 0 0-10-1.4A3.8 3.8 0 0 0 7 18Z" />
    </svg>
  );
}

function DbIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <ellipse cx="12" cy="7" rx="6" ry="3" fill="#3B82F6" />
      <path d="M6 7v10c0 1.7 2.7 3 6 3s6-1.3 6-3V7" stroke="#3B82F6" strokeWidth="2" />
      <path d="M6 12c0 1.7 2.7 3 6 3s6-1.3 6-3" stroke="#3B82F6" strokeWidth="2" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <path d="M12 3 21 18H3L12 3Z" fill="#22C55E" />
      <path d="M10.2 14.2 16.4 18H8.8l1.4-3.8Z" fill="#166534" opacity="0.35" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path
        d="M4 16 9 11 13 14 20 7"
        stroke="#2563EB"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="7" r="1.8" fill="#2563EB" />
    </svg>
  );
}

function Rocket({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path d="M16 4c6 6 6 14 3 18l-3 1-3-1c-3-4-3-12 3-18Z" fill="#8B5CF6" />
      <circle cx="16" cy="12" r="2.2" fill="#C4B5FD" />
      <path d="M11 20c-3 1-5 5-4 6 1 1 5-1 6-4" fill="#F97316" />
      <path d="M21 20c3 1 5 5 4 6-1 1-5-1-6-4" fill="#F97316" />
      <path d="M15 23h2l-1 6-1-6Z" fill="#FBBF24" />
    </svg>
  );
}

function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 0 13.8 8.4 22 10 13.8 11.6 12 20 10.2 11.6 2 10 10.2 8.4Z" />
    </svg>
  );
}
