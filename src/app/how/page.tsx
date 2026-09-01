import type { Metadata } from "next";
import { CHAIN, CONTRACTS, FEES, SITE } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "How it works",
  description: `Where the money goes on a ${SITE.unit}, and how the account it names gets it.`,
};

/* The money's route, drawn once. Four stops, and the only dashed box is the
   one nobody has walked into yet. */
function Flow() {
  const stops = [
    { title: "a trade", sub: `pays ${FEES.tradeFee}%` },
    { title: "the curve", sub: `books ${FEES.creatorFee}%` },
    { title: "their vault", sub: "keyed to @handle", dashed: true },
    { title: "them", sub: `less ${FEES.payoutCut}%` },
  ];
  const links = ["holds it", "anyone sweeps", "they prove it"];

  return (
    <div className="card-quiet p-6 sm:p-10 overflow-x-auto">
      <div className="flex items-start gap-3 sm:gap-5 min-w-max mx-auto w-fit">
        {stops.map((stop, i) => (
          <div key={stop.title} className="flex items-start gap-3 sm:gap-5">
            <div className="text-center">
              <div
                className={`px-5 sm:px-7 py-5 border ${
                  stop.dashed ? "border-dashed border-accent-line" : "border-line-strong"
                }`}
              >
                <p className={`text-sm ${stop.dashed ? "text-accent" : "text-fg"}`}>{stop.title}</p>
                <p className="numeral text-xs text-fg-muted mt-1.5">{stop.sub}</p>
              </div>
            </div>

            {i < links.length && (
              <div className="pt-6 text-center shrink-0">
                <svg width="44" height="8" viewBox="0 0 44 8" aria-hidden="true">
                  <path d="M0 4h38M34 1l4 3-4 3" stroke="var(--line-strong)" fill="none" />
                </svg>
                <p className="eyebrow mt-2 text-[0.5625rem]">{links[i]}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-16 grid md:grid-cols-[1fr_2fr] gap-6 md:gap-12">
      <h2 className="display text-3xl">{title}</h2>
      <div className="space-y-5 text-[0.9375rem] text-fg-soft leading-[1.75]">{children}</div>
    </section>
  );
}

export default function HowPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8 pt-16 sm:pt-24">
      <p className="eyebrow">The whole thing, plainly</p>
      <h1 className="display text-[clamp(2.25rem,5.4vw,3.75rem)] mt-5 mb-14">How it works</h1>

      <Flow />

      <Section title={`What a ${SITE.unit} is`}>
        <p>
          Anyone can open a coin in a TikTok account&rsquo;s name. Opening one buys you nothing: the
          person who presses the button does not receive the coin&rsquo;s creator fees and has no way
          to aim them anywhere. The pad replaces the fee recipient with a vault whose address is
          derived from the handle itself, so the vault exists from the first block whether or not the
          account holder has ever heard of this site.
        </p>
        <p>
          When they arrive and prove the account is theirs, they name a wallet and the vault empties
          into it. If they never arrive, the money stays exactly where it is. No one else can reach
          it — not the opener, not us.
        </p>
      </Section>

      <Section title="Where a trade&rsquo;s money goes">
        <p>
          Every buy and every sell on the bonding curve pays {FEES.tradeFee}%. {CHAIN.curve} keeps{" "}
          {FEES.curveShare}% of that as protocol revenue and books the remaining {FEES.creatorFee}%
          as the coin&rsquo;s creator fee. Whoever opened it may stack an extra cut on top, up to{" "}
          {FEES.surchargeMax}% — and that surcharge goes to the account as well, never to the opener.
        </p>
        <p>
          Moving those booked fees from the curve into the vault is a public function,{" "}
          <span className="numeral text-fg">sweep</span>, that anybody may call and that can only
          push money one way. {SITE.wordmark} calls it for you; so can you, from a block explorer,
          indefinitely, even if this website stops existing.
        </p>
        <p>
          At payout — and only at payout — {SITE.wordmark} keeps {FEES.payoutCut}% of what it hands
          over. That is the entire business. Nothing is skimmed on the way in, and the contract caps
          this at {FEES.payoutCeiling}%, so it cannot quietly grow past that later.
        </p>
      </Section>

      <Section title="Proving the account is yours">
        <p>
          You connect the wallet you want paid, and we hand you a code derived from your handle{" "}
          <em className="text-fg not-italic">and that wallet together</em>. The pairing is the
          point: a code tied only to a handle could be read out of your bio by anyone watching and
          replayed from their own address. Yours matches nobody else.
        </p>
        <p>Put it somewhere only the account holder can put it. Either route works:</p>
        <ul className="space-y-3 pl-5">
          <li className="list-disc marker:text-accent">
            <span className="text-fg">Your bio.</span> Paste it, press verify, delete it again. We
            read the public profile once and keep nothing.
          </li>
          <li className="list-disc marker:text-accent">
            <span className="text-fg">A video caption.</span> Post anything with the code in the
            caption and give us the link. This route goes through TikTok&rsquo;s own oEmbed endpoint,
            which answers for everyone, so it still works when a profile read gets refused.
          </li>
        </ul>
        <p>
          You also sign a sentence with your wallet — free, no transaction — so both halves are
          proved in one go: the account is yours, and so is the address about to be paid.
        </p>
      </Section>

      <section className="mt-16 grid sm:grid-cols-2 gap-5">
        <div className="card p-6">
          <p className="eyebrow mb-4">Cannot</p>
          <ul className="space-y-3.5 text-sm text-fg-soft leading-relaxed">
            <li>Send a vault&rsquo;s balance anywhere except the wallet bound to that handle.</li>
            <li>
              Take more than {FEES.payoutCeiling}% at payout. That ceiling is in the contract, not in
              a setting somebody can change.
            </li>
            <li>Redirect a live coin&rsquo;s fees away from the account it was opened for.</li>
          </ul>
        </div>
        <div className="card p-6">
          <p className="eyebrow mb-4">Can</p>
          <ul className="space-y-3.5 text-sm text-fg-soft leading-relaxed">
            <li>Write the handle-to-wallet binding once a TikTok check passes. Each one is a public event.</li>
            <li>Call sweep and pay the gas on your behalf.</li>
            <li>Change the platform fee, but only underneath that hard ceiling.</li>
          </ul>
        </div>
      </section>

      <Section title="After you claim">
        <p>
          Claiming empties the vault, but you can also take the fee stream itself. One call moves you
          into {CHAIN.curve}&rsquo;s own creator slot for that coin, after which the fees stop
          touching this pad entirely — and so does our cut.
        </p>
      </Section>

      <section className="mt-16">
        <p className="eyebrow mb-5">The contracts</p>
        <div className="card-quiet divide-y divide-[var(--line)]">
          {CONTRACTS.map((c) => (
            <a
              key={c.address}
              href={`${CHAIN.explorer}/address/${c.address}`}
              target="_blank"
              rel="noreferrer noopener"
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-5 py-4 hover:bg-surface-2 transition-colors"
            >
              <span className="text-sm text-fg">{c.label}</span>
              <span className="numeral text-xs text-fg-muted break-all">{c.address}</span>
            </a>
          ))}
        </div>
        <p className="eyebrow mt-4">
          {CHAIN.name} · chain id {CHAIN.id} · gas paid in {CHAIN.currency}
        </p>
      </section>

      <div className="mt-16 flex flex-wrap gap-3">
        <ButtonLink href="/start" variant="accent" size="lg">
          Open a {SITE.unit}
        </ButtonLink>
        <ButtonLink href="/claim" variant="outline" size="lg">
          Take your half
        </ButtonLink>
      </div>
    </div>
  );
}
