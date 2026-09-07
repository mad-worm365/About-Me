"use client";

import { Quote } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { testimonials } from "@/lib/data";
import { Reveal } from "./Reveal";

export function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const syncProgress = () => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? (el.scrollLeft / max) * 100 : 0);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    syncProgress();
    el.addEventListener("scroll", syncProgress, { passive: true });
    return () => el.removeEventListener("scroll", syncProgress);
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <Reveal>
        <p className="text-center text-xs font-semibold tracking-[0.22em] text-violet-500">
          TESTIMONIALS
        </p>
        <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight text-ink">
          People I have built with
        </h2>
      </Reveal>

      <div
        ref={trackRef}
        className="hide-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3"
      >
        {testimonials.map((item) => (
          <article
            key={item.name}
            className="w-[86%] shrink-0 snap-start rounded-[1.6rem] border border-line bg-surface p-6 shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:shadow-xl sm:w-[340px]"
          >
            <Quote className="h-8 w-8 text-violet-400" />
            <p className="mt-4 text-sm leading-7 text-muted">“{item.quote}”</p>
            <div className="mt-6 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-semibold text-white">
                {item.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{item.name}</p>
                <p className="text-xs text-muted">{item.role}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={progress}
        onChange={(event) => {
          const el = trackRef.current;
          if (!el) return;
          const max = el.scrollWidth - el.clientWidth;
          el.scrollTo({ left: (Number(event.target.value) / 100) * max });
        }}
        style={{ ["--value" as string]: `${progress}%` }}
        className="slider-bar mt-6"
        aria-label="Testimonials slider"
      />
    </section>
  );
}
