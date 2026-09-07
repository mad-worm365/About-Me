import { Brain, Cloud, Code2, Layers } from "lucide-react";
import { aboutCards } from "@/lib/data";
import { Reveal } from "./Reveal";
import { Worm } from "./Worm";

const icons = {
  brain: Brain,
  code: Code2,
  cloud: Cloud,
  layers: Layers,
};

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-24 lg:px-8">
      <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <div className="relative mx-auto w-72 rotate-[-6deg] sm:w-80">
            <div className="absolute -left-8 -top-6 text-3xl animate-float">💡</div>
            <div className="absolute -right-4 top-8 text-2xl animate-float-delayed">✨</div>
            <div className="rounded-[1.4rem] bg-surface p-3 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.35)]">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-100 via-sky-50 to-amber-50 dark:from-violet-900/40 dark:via-sky-900/30 dark:to-amber-900/20">
                <Worm pose="polaroid" className="mx-auto h-72 w-full" />
              </div>
              <p className="font-hand pt-3 text-center text-2xl text-ink">
                Keep building! :)
              </p>
            </div>
            <svg
              className="absolute -bottom-8 -right-8 h-16 w-24 text-violet-400"
              viewBox="0 0 120 60"
              fill="none"
            >
              <path
                d="M8 40c24-28 54-28 78-8"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray="140"
                strokeDashoffset="140"
                className="animate-draw"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.22em] text-violet-500">
              ABOUT ME
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              I turn ideas into{" "}
              <span className="text-gradient">intelligent</span> solutions.
            </h2>
            <p className="mt-4 max-w-xl text-muted">
              I help teams go from sketch to shipped system — pairing clean
              full-stack engineering with AI that is useful, measurable, and
              maintainable. Less demo magic, more products people keep using.
            </p>
            <p className="font-hand mt-4 text-2xl text-violet-600 dark:text-violet-300">
              Clean code × Smart AI = Real Impact
            </p>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {aboutCards.map((card, index) => {
              const Icon = icons[card.icon];
              return (
                <Reveal key={card.title} delay={index * 80}>
                  <article className="rounded-2xl border border-line bg-surface p-4 shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:shadow-lg">
                    <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-ink">{card.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted">{card.body}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
