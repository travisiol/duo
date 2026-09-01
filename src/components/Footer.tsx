import Link from "next/link";
import { CHAIN, CONTRACTS, NAV, SITE } from "@/lib/site";
import { shortAddress } from "@/lib/format";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="border-t border-line mt-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1.2fr]">
          <div>
            <div className="text-fg mb-4">
              <Wordmark />
            </div>
            <p className="text-sm text-fg-soft leading-relaxed max-w-xs">{SITE.tagline}</p>
            <a
              href={SITE.social}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-block mt-4 text-sm text-fg-muted hover:text-accent transition-colors"
            >
              {SITE.handle}
            </a>
          </div>

          <div>
            <p className="eyebrow mb-4">Pages</p>
            <ul className="space-y-2.5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-fg-soft hover:text-fg transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-4">On chain</p>
            <ul className="space-y-2.5">
              <li className="numeral text-sm text-fg-soft">
                {CHAIN.name} · {CHAIN.id}
              </li>
              {CONTRACTS.map((c) => (
                <li key={c.address}>
                  <a
                    href={`${CHAIN.explorer}/address/${c.address}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="numeral text-sm text-fg-muted hover:text-accent transition-colors"
                  >
                    {c.label.toLowerCase()} {shortAddress(c.address)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-12 pt-6 border-t border-line text-xs text-fg-muted leading-relaxed max-w-3xl">
          {SITE.wordmark} has no relationship with TikTok or ByteDance and speaks for none of the
          accounts named on it. Opening a {SITE.unit} is not an endorsement by the person it names.
          These are speculative tokens on a bonding curve; assume you can lose whatever you put in.
          Nothing here is financial advice.
        </p>
      </div>
    </footer>
  );
}
