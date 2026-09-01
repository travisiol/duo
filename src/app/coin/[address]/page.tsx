import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COINS, coinByAddress } from "@/lib/coins";
import { CHAIN, FEES, SITE } from "@/lib/site";
import { ago, eth, followers, price, shortAddress, usd } from "@/lib/format";
import { Stat } from "@/components/ui/Field";
import { ButtonLink } from "@/components/ui/Button";
import { TradePanel } from "@/components/TradePanel";

type Props = { params: Promise<{ address: string }> };

export function generateStaticParams() {
  return COINS.map((c) => ({ address: c.address }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { address } = await params;
  const coin = coinByAddress(address);
  if (!coin) return { title: "Not on the board" };
  return {
    title: `$${coin.ticker} · ${coin.name}`,
    description: `${coin.blurb} Fees are held for ${coin.handle}.`,
  };
}

export default async function CoinPage({ params }: Props) {
  const { address } = await params;
  const coin = coinByAddress(address);
  if (!coin) notFound();

  const owed = coin.status !== "claimed" && coin.waiting > 0;
  const theirCut = FEES.creatorFee + coin.surcharge;

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-12 sm:pt-16">
      <Link href="/" className="eyebrow hover:text-fg transition-colors">
        ← the board
      </Link>

      <header className="mt-8 flex items-start gap-5 flex-wrap">
        <div className="size-16 border border-line flex items-center justify-center shrink-0">
          <span className="numeral text-sm text-fg-soft">{coin.mark}</span>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="display text-[clamp(2.25rem,5vw,3.25rem)] leading-none">${coin.ticker}</h1>
          <p className="mt-2 text-base text-fg-soft">{coin.name}</p>
        </div>
        <p className="eyebrow pt-2">
          {coin.status === "graduated" ? "off the curve" : "on the curve"} ·{" "}
          {ago(coin.openedMinutesAgo)}
        </p>
      </header>

      <p className="mt-6 text-[0.9375rem] text-fg-soft leading-relaxed max-w-2xl">{coin.blurb}</p>

      <div className="mt-10 grid lg:grid-cols-[1.5fr_1fr] gap-6 items-start">
        <div className="space-y-6">
          <div className="card p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
            <Stat label="Mcap" value={usd(coin.mcap)} />
            <Stat label="Price" value={price(coin.price)} />
            <Stat label="Their cut" value={`${theirCut.toFixed(1)}%`} tone="accent" />
            <Stat label="Swept" value={`${coin.sweptPct}%`} tone="muted" />
          </div>

          {/* Placeholder for the curve. Kept as a hairline field rather than a
              fake chart — inventing a price history would be a lie about a
              coin that may have taken no trades at all. */}
          <div className="card p-6">
            <p className="eyebrow mb-5">Since it opened</p>
            <div className="h-48 border border-dashed border-line flex items-center justify-center">
              <p className="text-xs text-fg-muted">
                {coin.mcap ? "curve chart" : "no trades yet"}
              </p>
            </div>
          </div>

          <div className="card p-6">
            <p className="eyebrow mb-5">Where this coin&rsquo;s money goes</p>
            <dl className="space-y-3 text-sm">
              {[
                ["Every trade pays", `${FEES.tradeFee}%`],
                [`${CHAIN.curve} keeps`, `${FEES.curveShare}% of that`],
                ["Booked to the coin", `${FEES.creatorFee}%`],
                ["Opener's surcharge, also to them", `${coin.surcharge}%`],
                [`${SITE.wordmark} takes, at payout only`, `${FEES.payoutCut}%`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-fg-soft">{k}</dt>
                  <dd className="numeral text-fg">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 pt-5 border-t border-line text-xs text-fg-muted leading-relaxed">
              The opener, {shortAddress(coin.openedBy)}, receives none of this and cannot redirect
              it. Sweeping is a public call anyone may make.
            </p>
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24">
          <TradePanel ticker={coin.ticker} />

          <div className={`card p-6 ${owed ? "owed" : ""}`}>
            <p className="eyebrow mb-4">{coin.status === "claimed" ? "Claimed" : "The other half"}</p>

            <a
              href={coin.links.tiktok ?? "#"}
              target="_blank"
              rel="noreferrer noopener"
              className="numeral text-base text-fg hover:text-accent transition-colors"
            >
              {coin.handle}
            </a>
            <p className="text-xs text-fg-muted mt-1.5">
              {coin.status === "claimed"
                ? `paid to ${shortAddress(coin.claimedBy!)}`
                : `has not answered${coin.followers ? ` · ${followers(coin.followers)}` : ""}`}
            </p>

            <div className="mt-5 pt-5 border-t border-line">
              <p className="eyebrow mb-2">{coin.status === "claimed" ? "Earned" : "Waiting in vault"}</p>
              <p className={`numeral text-3xl ${owed ? "text-accent" : "text-fg-soft"}`}>
                {eth(coin.waiting)}
              </p>
            </div>

            {coin.status !== "claimed" && (
              <ButtonLink href="/claim" variant="accent" size="md" className="mt-6 w-full">
                This is my account
              </ButtonLink>
            )}
          </div>

          <div className="card-quiet p-5">
            <p className="eyebrow mb-3">Contract</p>
            <a
              href={`${CHAIN.explorer}/address/${coin.address}`}
              target="_blank"
              rel="noreferrer noopener"
              className="numeral text-xs text-fg-muted hover:text-accent transition-colors break-all"
            >
              {coin.address}
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
