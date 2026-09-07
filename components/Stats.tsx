"use client";

import { Globe, Layers, Sparkles, Users, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stats } from "@/lib/data";

const icons = {
  spark: Sparkles,
  layers: Layers,
  globe: Globe,
  zap: Zap,
  users: Users,
};

const tones = [
  "bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300",
  "bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300",
  "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300",
  "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300",
  "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300",
];

export function Stats() {
  return (
    <section className="relative z-10 mx-auto -mt-4 max-w-6xl px-5 lg:px-8">
      <div className="grid gap-3 rounded-[1.7rem] border border-line bg-surface p-4 shadow-[0_20px_60px_-32px_rgba(15,23,42,0.25)] backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat, index) => {
          const Icon = icons[stat.icon];
          return (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:-translate-y-0.5"
            >
              <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${tones[index]}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-semibold text-ink">
                  <Counter value={stat.value} />
                  {stat.suffix}
                </p>
                <p className="text-xs leading-4 text-muted">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Counter({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return;
      started.current = true;
      const start = performance.now();
      const duration = 1100;

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        setCount(Math.round(value * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{count}</span>;
}
