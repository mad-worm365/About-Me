"use client";

import { Download, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/data";
import { ThemeToggle } from "./ThemeToggle";
import { Worm } from "./Worm";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const sections = navLinks.map((link) => link.href.slice(1));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(`#${id}`);
          break;
        }
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line bg-surface/80 shadow-sm backdrop-blur-xl"
          : "bg-transparent backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 lg:px-8">
        <a href="#home" className="flex items-center gap-2">
          <Worm pose="logo" className="h-11 w-11 transition-transform duration-300 hover:animate-wiggle" />
          <span className="leading-tight">
            <span className="block text-base font-semibold tracking-tight text-ink">
              Mad Worm
            </span>
            <span className="block text-[11px] font-medium text-muted">
              AI · Full Stack Engineer
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`relative text-sm font-medium transition-colors ${
                active === link.href
                  ? "text-ink"
                  : "text-muted hover:text-ink"
              }`}
            >
              {link.label}
              <span
                className={`absolute -top-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-sky-500 transition-all ${
                  active === link.href ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
              />
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <a
            href="/cv.txt"
            download
            className="btn-shine inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:scale-[1.03]"
          >
            <Download className="h-4 w-4" />
            Download CV
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="rounded-xl border border-line p-2 text-ink"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-line bg-surface/95 backdrop-blur-xl transition-all duration-300 lg:hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-3 px-5 py-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-ink"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/cv.txt"
            download
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Download className="h-4 w-4" />
            Download CV
          </a>
        </div>
      </div>
    </header>
  );
}
