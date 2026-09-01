"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { NAV, SITE } from "@/lib/site";
import { Wordmark } from "./Wordmark";
import { Button } from "./ui/Button";

export function Nav() {
  const path = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-page/85 backdrop-blur-md border-b border-line">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-fg hover:text-accent transition-colors">
            <Wordmark />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((item) => {
              const active = item.href === "/" ? path === "/" : path.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "text-[0.8125rem] transition-colors relative py-1",
                    active ? "text-accent" : "text-fg-soft hover:text-fg",
                  )}
                >
                  {item.label}
                  {active && (
                    <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-accent" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href={SITE.social}
              target="_blank"
              rel="noreferrer noopener"
              className="text-fg-muted hover:text-fg transition-colors hidden sm:block"
              aria-label={`${SITE.wordmark} on X`}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.9 2H22l-7.2 8.3L23.3 22h-6.6l-5.2-6.8L5.5 22H2.4l7.7-8.9L1.3 2H8l4.7 6.2L18.9 2Zm-1.1 18h1.7L7.3 3.7H5.5L17.8 20Z" />
              </svg>
            </a>
            <Button variant="accent" size="sm">
              Connect
            </Button>
          </div>
        </div>

        {/* On narrow screens the nav becomes a second rule under the mark
            rather than a hamburger — four items do not earn a drawer. */}
        <nav className="md:hidden flex items-center gap-6 pb-3 -mt-1 overflow-x-auto">
          {NAV.map((item) => {
            const active = item.href === "/" ? path === "/" : path.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "text-xs whitespace-nowrap transition-colors",
                  active ? "text-accent" : "text-fg-muted",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
