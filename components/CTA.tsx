import { ArrowRight } from "lucide-react";

const items = [
  ["1M+", "Lines of Code"],
  ["99.9%", "Uptime"],
  ["50+", "Happy Clients"],
  ["30+", "Technologies"],
];

export function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-violet-600 via-indigo-600 to-emerald-400 p-1 shadow-[0_24px_70px_-28px_rgba(91,33,182,0.6)]">
        <div className="relative overflow-hidden rounded-[1.85rem] px-6 py-10 sm:px-10">
          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <h2 className="max-w-sm text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Merging AI + Full Stack for real-world impact.
            </h2>
            <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4">
              {items.map(([value, label]) => (
                <div key={label} className="text-white">
                  <p className="text-2xl font-semibold">{value}</p>
                  <p className="text-xs text-white/80">{label}</p>
                </div>
              ))}
            </div>
            <a
              href="#contact"
              className="btn-shine inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-violet-700 shadow-lg transition hover:scale-[1.03]"
            >
              Let’s Build Together
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
