import Link from "next/link";
import clsx from "clsx";
import type { Coin } from "@/lib/coins";
import { CHAIN, FEES } from "@/lib/site";
import { ago, eth, followers, price, shortAddress, usd } from "@/lib/format";
import { Stat } from "./ui/Field";

const QUICK_BUYS = [0.01, 0.05, 0.1];

function StatusLine({ coin }: { coin: Coin }) {
  if (coin.status === "claimed") {
    return (
      <span className="text-fg-soft">
        answered · paid to <span className="numeral">{shortAddress(coin.claimedBy!)}</span>
      </span>
    );
  }
  return (
    <span className="text-fg-muted">
      has not answered{coin.followers ? ` · ${followers(coin.followers)}` : ""}
    </span>
  );
}

export function CoinCard({ coin }: { coin: Coin }) {
  const owed = coin.status !== "claimed" && coin.waiting > 0;

  return (
    <article
      className={clsx("card p-5 sm:p-6 transition-colors hover:border-line-strong", owed && "owed")}
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0 size-12 border border-line flex items-center justify-center">
          <span className="numeral text-xs text-fg-soft">{coin.mark}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <Link
              href={`/coin/${coin.address}`}
              className="display text-2xl text-fg hover:text-accent transition-colors"
            >
              ${coin.ticker}
            </Link>
            <span className="text-sm text-fg-soft truncate">{coin.name}</span>
          </div>
          <p className="eyebrow mt-1">
            {coin.status === "graduated" ? "off the curve" : "on the curve"}
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {coin.links.tiktok && (
            <a
              href={coin.links.tiktok}
              target="_blank"
              rel="noreferrer noopener"
              className="eyebrow hover:text-fg transition-colors"
            >
              TikTok
            </a>
          )}
          {coin.links.x && (
            <a
              href={coin.links.x}
              target="_blank"
              rel="noreferrer noopener"
              className="eyebrow hover:text-fg transition-colors"
            >
              X
            </a>
          )}
        </div>
      </div>

      <p className="mt-4 text-sm text-fg-soft leading-relaxed">{coin.blurb}</p>

      <div className="mt-5 pt-5 border-t border-line grid grid-cols-3 gap-4">
        <Stat label="Mcap" value={usd(coin.mcap)} />
        <Stat label="Price" value={price(coin.price)} />
        <Stat
          label="Their cut"
          value={`${(FEES.creatorFee + coin.surcharge).toFixed(1)}%`}
          tone="accent"
        />
      </div>

      {/* The half that is owed. This block is the reason the page exists, so it
          is the only one on the card allowed to carry the metal. */}
      <div
        className={clsx("mt-5 p-4 border", owed ? "border-accent-line bg-accent/5" : "border-line bg-page")}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <a
              href={coin.links.tiktok ?? "#"}
              target="_blank"
              rel="noreferrer noopener"
              className="numeral text-sm text-fg hover:text-accent transition-colors inline-flex items-center gap-1.5"
            >
              {coin.handle}
              {coin.verified && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-label="verified on tiktok"
                >
                  <circle cx="12" cy="12" r="9.5" fill="currentColor" opacity="0.2" />
                  <path
                    d="m8.2 12.3 2.5 2.5 5.1-5.1"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </a>
            <p className="mt-1 text-xs">
              <StatusLine coin={coin} />
            </p>
          </div>

          <div className="text-right shrink-0">
            <p className="eyebrow mb-1">{coin.status === "claimed" ? "Earned" : "Waiting"}</p>
            <p className={clsx("numeral text-sm", owed ? "text-accent" : "text-fg-soft")}>
              {eth(coin.waiting)}
            </p>
          </div>
        </div>

        <p className="mt-3 pt-3 border-t border-line eyebrow">
          {coin.sweptPct}% swept · {coin.sweptEth.toFixed(3)} {CHAIN.symbol} booked
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex gap-2">
          {QUICK_BUYS.map((amount) => (
            <button
              key={amount}
              className="numeral text-xs px-3 py-1.5 rounded-lg border-2 border-line-strong bg-surface text-fg-soft hover:border-accent hover:text-accent transition-colors"
            >
              {amount} {CHAIN.symbol}
            </button>
          ))}
        </div>
        <p className="eyebrow hidden sm:block">
          {shortAddress(coin.openedBy)} · {ago(coin.openedMinutesAgo)}
        </p>
      </div>
    </article>
  );
}
