import { Mail } from "lucide-react";
import { navLinks } from "@/lib/data";
import { GitHubIcon, LinkedInIcon, XIcon } from "./SocialIcons";
import { Worm } from "./Worm";

const socials = [
  { href: "https://github.com", icon: GitHubIcon, label: "GitHub" },
  { href: "https://linkedin.com", icon: LinkedInIcon, label: "LinkedIn" },
  { href: "https://twitter.com", icon: XIcon, label: "Twitter" },
  { href: "mailto:hello@madworm.dev", icon: Mail, label: "Email" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <a href="#home" className="flex items-center gap-2">
            <Worm pose="logo" className="h-10 w-10" />
            <span className="text-sm font-semibold text-ink">Mad Worm</span>
          </a>
          <nav className="flex flex-wrap justify-center gap-5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted transition hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition hover:text-violet-600"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Mad Worm. All rights reserved.</p>
          <p>Built with ❤️ and Next.js</p>
        </div>
      </div>
    </footer>
  );
}
