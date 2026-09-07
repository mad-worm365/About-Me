import { Brain, CloudLightning, Code2, Zap } from "lucide-react";
import { focusAreas } from "@/lib/data";
import { Reveal } from "./Reveal";

const icons = [Brain, Code2, CloudLightning, Zap];
const tones = [
  "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300",
  "bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300",
  "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  "bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300",
];

export function Focus() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-10 lg:px-8">
      <Reveal>
        <p className="text-center text-xs font-semibold tracking-[0.22em] text-violet-500">
          AI & FULL STACK FOCUS
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center text-3xl font-semibold tracking-tight text-ink">
          The four things I keep coming back to
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {focusAreas.map((area, index) => {
          const Icon = icons[index];
          return (
            <Reveal key={area.title} delay={index * 90}>
              <article className="group h-full rounded-[1.5rem] border border-line bg-surface p-6 shadow-sm backdrop-blur-md transition hover:-translate-y-1.5 hover:shadow-xl">
                <div
                  className={`mb-5 grid h-12 w-12 place-items-center rounded-2xl ${tones[index]} transition group-hover:scale-110`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-ink">{area.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{area.body}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
