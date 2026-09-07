"use client";

import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { projects } from "@/lib/data";
import { Reveal } from "./Reveal";

export function Projects() {
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
    window.addEventListener("resize", syncProgress);
    return () => {
      el.removeEventListener("scroll", syncProgress);
      window.removeEventListener("resize", syncProgress);
    };
  }, []);

  const scrollByCard = (direction: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("article");
    const amount = card ? card.clientWidth + 20 : 360;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <section id="projects" className="mx-auto max-w-6xl px-5 py-24 lg:px-8">
      <Reveal>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-violet-500">
              FEATURED PROJECTS
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Work that ships and scales
            </h2>
          </div>
          <a
            href="#contact"
            className="hidden text-sm font-semibold text-violet-500 transition hover:text-violet-300 sm:inline"
          >
            View All Projects →
          </a>
        </div>
      </Reveal>

      <div
        ref={trackRef}
        className="hide-scrollbar -mx-1 flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-6"
      >
        {projects.map((project, index) => (
          <article
            key={project.title}
            className="group w-[86%] shrink-0 snap-start overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#0c1222] shadow-[0_18px_50px_-24px_rgba(0,0,0,0.65)] transition duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-[0_24px_60px_-20px_rgba(91,33,182,0.45)] sm:w-[340px] lg:w-[calc((100%-2.5rem)/3)]"
          >
            <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${project.accent}`}>
              <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-10 left-10 h-24 w-24 rounded-full bg-black/10 blur-2xl" />
              <ProjectPreview variant={index} />
              <span className="absolute bottom-3 left-3 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                {project.metric}
              </span>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold tracking-tight text-white">
                  {project.title}
                </h3>
                <a
                  href="#contact"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-slate-300 ring-1 ring-white/10 transition group-hover:bg-violet-500 group-hover:text-white group-hover:ring-violet-400"
                  aria-label={`Open ${project.title}`}
                >
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-400">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300 ring-1 ring-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-[#0c1222]/80 text-slate-200 shadow-sm backdrop-blur-md transition hover:border-violet-400 hover:text-white"
          aria-label="Previous project"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
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
          className="slider-bar project-slider"
          aria-label="Project slider"
        />
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-[#0c1222]/80 text-slate-200 shadow-sm backdrop-blur-md transition hover:border-violet-400 hover:text-white"
          aria-label="Next project"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

function ProjectPreview({ variant }: { variant: number }) {
  return (
    <div className="absolute inset-x-5 top-5 overflow-hidden rounded-2xl border border-white/30 bg-white/18 shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-1.5 border-b border-white/20 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-white/90" />
        <span className="h-2 w-2 rounded-full bg-white/55" />
        <span className="h-2 w-2 rounded-full bg-white/55" />
        <span className="ml-2 h-1.5 flex-1 rounded-full bg-white/25" />
      </div>
      <div className="grid grid-cols-5 gap-2 p-3">
        <div className="col-span-2 space-y-2">
          <div className="h-2 w-4/5 rounded bg-white/70" />
          <div className="h-2 w-full rounded bg-white/35" />
          <div className="h-2 w-3/5 rounded bg-white/35" />
          {variant % 2 === 0 ? (
            <div className="mt-3 h-14 rounded-xl bg-white/20" />
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-1.5">
              <div className="h-14 rounded-lg bg-white/25" />
              <div className="h-14 rounded-lg bg-white/15" />
            </div>
          )}
        </div>
        <div className="col-span-3 space-y-1.5">
          {variant % 3 === 0 && (
            <>
              <div className="ml-auto h-6 w-4/5 rounded-lg bg-white/70" />
              <div className="h-6 w-3/4 rounded-lg bg-white/25" />
              <div className="ml-auto h-6 w-2/3 rounded-lg bg-white/55" />
            </>
          )}
          {variant % 3 === 1 && (
            <div className="grid h-full grid-cols-3 gap-1.5">
              <div className="rounded-lg bg-white/25" />
              <div className="rounded-lg bg-white/45" />
              <div className="rounded-lg bg-white/20" />
            </div>
          )}
          {variant % 3 === 2 && (
            <div className="flex h-[72px] items-end gap-1.5">
              <div className="h-1/2 flex-1 rounded-t-md bg-white/25" />
              <div className="h-3/4 flex-1 rounded-t-md bg-white/55" />
              <div className="h-2/5 flex-1 rounded-t-md bg-white/30" />
              <div className="h-full flex-1 rounded-t-md bg-white/70" />
              <div className="h-3/5 flex-1 rounded-t-md bg-white/35" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
