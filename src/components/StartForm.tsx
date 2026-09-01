"use client";

import { useState } from "react";
import { CHAIN, FEES, SITE } from "@/lib/site";
import { Button } from "./ui/Button";
import { Input, Labelled } from "./ui/Field";

const LAUNCH_FEE = 0.0005;

export function StartForm() {
  const [handle, setHandle] = useState("");
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [surcharge, setSurcharge] = useState(0);

  const theirCut = FEES.creatorFee + surcharge;

  return (
    <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
      <form className="card p-6 sm:p-8 space-y-8" onSubmit={(e) => e.preventDefault()}>
        <Labelled
          label="Whose coin is this?"
          hint="Any public TikTok account. They do not need to know yet."
        >
          <div className="flex items-stretch">
            <span className="numeral text-sm text-fg-muted border border-r-0 border-line px-3.5 flex items-center">
              @
            </span>
            <Input
              value={handle}
              onChange={(e) => setHandle(e.target.value.replace(/^@/, ""))}
              placeholder="handle"
              className="font-mono"
            />
          </div>
        </Labelled>

        <div className="grid sm:grid-cols-[2fr_1fr] gap-5">
          <Labelled label="Coin name">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Lumen Kitchen"
            />
          </Labelled>
          <Labelled label="Ticker">
            <Input
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase().slice(0, 8))}
              placeholder="LUMEN"
              className="font-mono uppercase"
            />
          </Labelled>
        </div>

        <Labelled
          label="Coin art"
          hint="Square images read best. The coin stores a link to the bytes you upload."
        >
          <div className="border border-dashed border-line p-10 text-center hover:border-line-strong transition-colors cursor-pointer">
            <p className="text-sm text-fg-soft">Drop an image, or click</p>
            <p className="eyebrow mt-2">cropped to 320px square</p>
          </div>
        </Labelled>

        <Labelled
          label={`Extra cut for them — ${surcharge.toFixed(1)}%`}
          hint={`Stacked on top of the ${FEES.creatorFee}% the curve already books. It goes to the account, not to you. There is no setting that sends it to you.`}
        >
          <input
            type="range"
            min={0}
            max={FEES.surchargeMax}
            step={0.1}
            value={surcharge}
            onChange={(e) => setSurcharge(Number(e.target.value))}
            className="w-full accent-[var(--accent)]"
          />
          <div className="flex justify-between eyebrow mt-2">
            <span>0%</span>
            <span>{FEES.surchargeMax}%</span>
          </div>
        </Labelled>

        <Button variant="accent" size="lg" className="w-full">
          Open the {SITE.unit}
        </Button>
      </form>

      <aside className="space-y-5 lg:sticky lg:top-24">
        {/* The two halves, live. Yours stays grey; theirs is the only thing on
            the page that gets the metal. */}
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-line">
            <p className="eyebrow mb-3">Your half</p>
            <div className="flex items-center gap-3">
              <div className="size-10 border border-line flex items-center justify-center">
                <span className="numeral text-xs text-fg-muted">
                  {ticker ? ticker.slice(0, 2) : "?"}
                </span>
              </div>
              <div className="min-w-0">
                <p className="numeral text-sm text-fg truncate">${ticker || "???"}</p>
                <p className="text-xs text-fg-muted truncate">{name || "unnamed"}</p>
              </div>
            </div>
          </div>

          <div className="p-5 bg-accent/5">
            <p className="eyebrow mb-3">Their half</p>
            <div className="flex items-center gap-3">
              <div className="size-10 border border-dashed border-accent-line flex items-center justify-center">
                <span className="numeral text-xs text-accent">?</span>
              </div>
              <div className="min-w-0">
                <p className="numeral text-sm text-accent truncate">@{handle || "nobody"}</p>
                <p className="text-xs text-fg-muted">
                  {handle ? `takes ${theirCut.toFixed(1)}% of every trade` : "waiting for a handle"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <p className="eyebrow mb-4">What it costs you</p>
          <dl className="space-y-2.5 text-sm">
            {[
              [`${CHAIN.curve} launch fee`, `${LAUNCH_FEE} ${CHAIN.currency}`],
              ["Your surcharge", `0 ${CHAIN.currency}`],
              ["Gas", "a fraction of a cent"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="text-fg-soft">{k}</dt>
                <dd className="numeral text-fg-soft">{v}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-4 pt-3 border-t border-dashed border-line">
              <dt className="text-fg">Total</dt>
              <dd className="numeral text-accent">
                {LAUNCH_FEE} {CHAIN.currency}
              </dd>
            </div>
          </dl>
        </div>

        <div className="card p-5">
          <p className="eyebrow mb-3">Where the fees go</p>
          <p className="text-xs text-fg-soft leading-relaxed">
            Each trade pays {FEES.tradeFee}%. {CHAIN.curve} keeps {FEES.curveShare}% of it; the
            remaining {FEES.creatorFee}% plus your surcharge is booked to the coin and swept into a
            vault keyed to <span className="numeral text-fg">@{handle || "the handle"}</span>. You
            cannot withdraw from it and neither can we — {SITE.wordmark} takes{" "}
            {FEES.payoutCut}% only when it pays out.
          </p>
        </div>
      </aside>
    </div>
  );
}
