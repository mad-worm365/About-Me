"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, ready, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light theme" : "Dark theme"}
      className="group relative h-11 w-11 shrink-0 perspective-[240px]"
    >
      <span
        className={`relative block h-full w-full transition-transform duration-500 transform-3d ${
          ready && isDark ? "transform-[rotateY(180deg)]" : ""
        }`}
      >
        <span className="absolute inset-0 grid place-items-center rounded-2xl border border-line bg-amber-50 text-amber-600 shadow-sm backface-hidden dark:border-transparent">
          <Sun className="h-4 w-4 transition group-hover:rotate-45" />
        </span>
        <span className="absolute inset-0 grid place-items-center rounded-2xl border border-indigo-400/30 bg-indigo-950 text-violet-200 shadow-sm backface-hidden transform-[rotateY(180deg)]">
          <Moon className="h-4 w-4 transition group-hover:-rotate-12" />
        </span>
      </span>
    </button>
  );
}
