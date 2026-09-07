"use client";

import { ArrowRight, Mail, Sparkles } from "lucide-react";
import { HeroScene } from "./HeroScene";
import { GitHubIcon, LinkedInIcon, XIcon } from "./SocialIcons";

const socials = [
  { href: "https://github.com", label: "GitHub", icon: GitHubIcon },
  { href: "https://linkedin.com", label: "LinkedIn", icon: LinkedInIcon },
  { href: "https://twitter.com", label: "Twitter", icon: XIcon },
  { href: "mailto:hello@madworm.dev", label: "Email", icon: Mail },
];

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-white/45 dark:bg-transparent" />
      <div className="pointer-events-none absolute -left-16 top-10 h-64 w-64 rounded-full bg-sky-200/50 blur-3xl dark:bg-sky-500/10" />
      <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-violet-200/50 blur-3xl dark:bg-violet-500/10" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-5 py-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:px-8 lg:py-16">
        <div className="animate-slide-up">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#dcf6d0] px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.08em] text-[#2f7a32] dark:bg-lime-900/50 dark:text-lime-200">
            <Sparkles className="h-3.5 w-3.5 fill-amber-300 text-amber-400" />
            AI-FOCUSED FULL STACK ENGINEER
          </div>

          <h1 className="max-w-[560px] text-[34px] font-bold leading-[1.12] tracking-tight text-[#151a2d] sm:text-5xl lg:text-[52px] dark:text-ink">
            Building intelligent web applications with{" "}
            <span className="bg-linear-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">
              AI & Full Stack
            </span>
          </h1>

          <p className="mt-5 max-w-[470px] text-[15px] leading-7 text-[#667085] sm:text-base dark:text-muted">
            I build scalable, secure and high-performance web applications
            powered by modern technologies and AI.
          </p>
          <p className="mt-3 max-w-[470px] text-[15px] leading-7 text-[#667085] sm:text-base dark:text-muted">
            From idea to production — I turn concepts into real products that
            make an impact.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="btn-shine inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#8B5CF6] to-[#3B82F6] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(139,92,246,0.32)] transition hover:scale-[1.03]"
            >
              View My Projects
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-[#e4e7ec] bg-white px-6 py-3 text-sm font-semibold text-[#151a2d] shadow-sm transition hover:-translate-y-0.5 dark:border-line dark:bg-surface dark:text-ink"
            >
              Get In Touch
              <Mail className="h-4 w-4 text-[#8B5CF6]" />
            </a>
          </div>

          <div className="mt-7 flex items-center gap-5 text-[#344054] dark:text-slate-300">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="transition hover:-translate-y-0.5 hover:text-violet-600"
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="animate-fade-in">
          <HeroScene />
        </div>
      </div>
    </section>
  );
}
