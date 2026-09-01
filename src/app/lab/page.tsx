import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./lab.css";

export const metadata: Metadata = {
  title: "Art direction bake-off",
  robots: { index: false, follow: false },
};

/* Loaded here rather than in the root layout — only this route needs them,
   and whichever direction wins gets promoted properly afterwards. */
const space = Space_Grotesk({
  weight: ["500", "700"],
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const DIRECTIONS = [
  {
    id: "riso",
    n: 1,
    name: "Riso print",
    note: "Fanzine on cheap paper. Two spot inks that never blend, hard offset shadows, ink-black keylines, zero radius. Loudest of the four and the furthest from anything that looks like a bank.",
  },
  {
    id: "pop",
    n: 2,
    name: "Candy pop",
    note: "Keeps the original's energy but swaps acid for sugar: warm paper, chunky rounded cards, violet and pink doing the shouting. The most obviously TikTok-native.",
  },
  {
    id: "chrome",
    n: 3,
    name: "Chrome",
    note: "Dark, glassy, iridescent — the register crypto actually dresses in. Light comes from behind the surfaces instead of from ink. Expensive-looking, slightly cold.",
  },
  {
    id: "terminal",
    n: 4,
    name: "Terminal",
    note: "Everything mono, everything a row, one mint accent. Reads like a trading desk pointed at TikTok. Densest and most serious of the four.",
  },
] as const;

function MiniSite() {
  return (
    <>
      <div className="da-bar">
        <div className="da-mark">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="8" cy="12" r="6.25" stroke="currentColor" strokeWidth="1.6" />
            <circle
              cx="16"
              cy="12"
              r="6.25"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeDasharray="2.2 2.4"
            />
          </svg>
          Duo
        </div>
        <div className="da-links">
          <b>The board</b>
          <span>Open one</span>
          <span>Your half</span>
        </div>
      </div>

      <h3 className="da-h1">
        Every coin here
        <br />
        is <em>half</em> unclaimed.
      </h3>
      <p className="da-sub">
        Open a market in any TikTok account&rsquo;s name. The fees collect in a vault keyed to the
        handle until that person turns up.
      </p>

      <div className="da-btns">
        <button className="da-btn">Open a duo</button>
        <button className="da-btn ghost">Someone opened mine</button>
      </div>

      <div className="da-card">
        <div className="da-card-top">
          <span className="da-ticker">$LUMEN</span>
          <span className="da-name">Lumen Kitchen</span>
        </div>

        <div className="da-stats">
          <div className="da-stat">
            <span>Mcap</span>
            <b>$5.6K</b>
          </div>
          <div className="da-stat">
            <span>Price</span>
            <b>$0.0₅561</b>
          </div>
          <div className="da-stat">
            <span>Their cut</span>
            <b>1.9%</b>
          </div>
        </div>

        <div className="da-owed">
          <div>
            <small>The other half</small>
            <span className="da-handle">@lumenkitchen</span>
          </div>
          <div>
            <small>Waiting</small>
            <span className="da-amount">0.0165 Ξ</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default function LabPage() {
  return (
    <div className={space.variable}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-16 sm:pt-20">
        <p className="eyebrow">Pick one</p>
        <h1 className="display text-[clamp(2rem,4.8vw,3.25rem)] mt-4">Four directions</h1>
        <p className="mt-5 mb-14 text-base text-fg-soft leading-relaxed max-w-2xl">
          The same bar, headline and coin card in four art directions. Identical markup in each —
          only the colour, type and edge treatment change. Tell me a number and I will roll it across
          every page.
        </p>

        <div className="grid gap-10 lg:grid-cols-2">
          {DIRECTIONS.map((d) => (
            <section key={d.id}>
              <div className="flex items-baseline gap-3 mb-1">
                <span className="numeral text-sm text-accent">{d.n}</span>
                <h2 className="display text-2xl">{d.name}</h2>
              </div>
              <p className="text-xs text-fg-muted leading-relaxed mb-4 max-w-md">{d.note}</p>
              <div className="da" data-da={d.id}>
                <MiniSite />
              </div>
            </section>
          ))}
        </div>

        <p className="mt-14 text-sm text-fg-muted">
          Candy pop won and is now live across every page. The other three are kept here as
          swatches — say the word and one of them takes over instead.
        </p>
      </div>
    </div>
  );
}
