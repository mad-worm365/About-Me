import { skills } from "@/lib/data";
import { Reveal } from "./Reveal";

export function Skills() {
  const loop = [...skills, ...skills];

  return (
    <section id="skills" className="overflow-hidden py-10">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <p className="text-center text-xs font-semibold tracking-[0.22em] text-violet-500">
            SKILLS & TECHNOLOGIES
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-center text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            A toolkit built for shipping AI products
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted">
            Frontend, backend, cloud, and the AI layer — chosen for speed,
            reliability, and how well they work together.
          </p>
        </Reveal>
      </div>

      <div className="relative mt-10">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
        <div className="flex w-max animate-marquee gap-3">
          {loop.map((skill, index) => (
            <SkillChip key={`${skill.name}-${index}`} name={skill.name} color={skill.color} />
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-6xl grid-cols-2 gap-3 px-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 lg:px-8">
        {skills.map((skill, index) => (
          <Reveal key={skill.name} delay={(index % 7) * 40}>
            <div className="group rounded-2xl border border-line bg-surface px-3 py-4 text-center shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg">
              <div
                className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-xl text-xs font-bold text-white shadow-sm transition group-hover:scale-110"
                style={{ background: skill.color }}
              >
                {skill.name.slice(0, 2)}
              </div>
              <p className="text-xs font-medium text-ink">{skill.name}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function SkillChip({ name, color }: { name: string; color: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 shadow-sm">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      <span className="text-sm font-medium text-ink">{name}</span>
    </div>
  );
}
