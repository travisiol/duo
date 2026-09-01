import { CHAIN, SITE } from "@/lib/site";
import { boardStats } from "@/lib/coins";
import { eth } from "@/lib/format";
import { ButtonLink } from "./ui/Button";

/* Two halves of a frame: one filled in, one still an outline waiting for the
   person it was drawn for. The whole product in one figure. */
function SplitFigure() {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-auto" role="img" aria-label="A split frame: one side drawn in, the other an empty outline still waiting">
      <rect x="10" y="14" width="280" height="164" rx="14" stroke="var(--line-strong)" strokeWidth="2.4" fill="var(--surface)" />
      <line x1="150" y1="14" x2="150" y2="178" stroke="var(--line-strong)" strokeWidth="2" strokeDasharray="4 6" />

      {/* Left: the person who turned up. */}
      <circle cx="80" cy="76" r="22" stroke="var(--fg)" strokeWidth="2.4" fill="none" />
      <path d="M42 152a38 38 0 0 1 76 0" stroke="var(--fg)" strokeWidth="2.4" fill="none" />

      {/* Right: the half that is owed, drawn but not yet real. */}
      <circle
        cx="220"
        cy="76"
        r="22"
        stroke="var(--accent)"
        strokeWidth="2.4"
        strokeDasharray="4 5"
        fill="none"

      />
      <path
        d="M182 152a38 38 0 0 1 76 0"
        stroke="var(--accent)"
        strokeWidth="2.4"
        strokeDasharray="4 5"
        fill="none"

      />
      <text
        x="220"
        y="76"
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--accent)"
        fontSize="17"
        fontFamily="var(--font-mono)"
      >
        ?
      </text>
    </svg>
  );
}

function Figure({ label, value, note, accent }: { label: string; value: string; note: string; accent?: boolean }) {
  return (
    <div className="card p-6">
      <p className="eyebrow">{label}</p>
      <p className={`numeral text-3xl mt-3 ${accent ? "text-accent" : "text-fg"}`}>{value}</p>
      <p className="text-xs text-fg-muted mt-3 leading-relaxed">{note}</p>
    </div>
  );
}

export function Hero() {
  const stats = boardStats();

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 sm:px-8 pt-16 sm:pt-24">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-center">
          <div>
            <p className="eyebrow">
              {CHAIN.name} · curve by {CHAIN.curve}
            </p>

            <h1 className="display text-[clamp(2.5rem,6.2vw,4.5rem)] mt-6">
              Every coin here
              <br />
              is <span className="text-accent">half</span> unclaimed.
            </h1>

            <p className="mt-7 text-base text-fg-soft leading-relaxed max-w-lg">
              Open a market in any TikTok account&rsquo;s name. The creator fees never come to you —
              they collect in a vault whose address is computed from the handle itself, and they sit
              there until that person turns up and proves the account is theirs.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/start" variant="accent" size="lg">
                Open a {SITE.unit}
              </ButtonLink>
              <ButtonLink href="/claim" variant="outline" size="lg">
                Someone opened mine
              </ButtonLink>
            </div>
          </div>

          <div className="lg:pl-8">
            <SplitFigure />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-16 grid gap-5 sm:grid-cols-3">
        <Figure
          label="Sitting unclaimed"
          value={eth(stats.waiting, 3)}
          note="held for accounts that have not answered"
          accent
        />
        <Figure
          label="Voices missing"
          value={String(stats.unclaimed)}
          note={`${SITE.unitPlural} whose other half has not shown up`}
        />
        <Figure
          label="Opened"
          value={String(stats.opened)}
          note="since the pad went live"
        />
      </section>
    </>
  );
}
