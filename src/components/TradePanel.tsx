"use client";

import { useState } from "react";
import clsx from "clsx";
import { CHAIN } from "@/lib/site";
import { Button } from "./ui/Button";
import { Input } from "./ui/Field";

const PRESETS = [0.01, 0.05, 0.1, 0.5];

export function TradePanel({ ticker }: { ticker: string }) {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");

  return (
    <div className="card p-6">
      <div className="flex gap-1 mb-6">
        {(["buy", "sell"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSide(s)}
            className={clsx(
              "eyebrow flex-1 py-2.5 rounded-lg border-2 transition-colors",
              side === s
                ? s === "buy"
                  ? "border-gain text-gain"
                  : "border-loss text-loss"
                : "border-line hover:text-fg-soft",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <Input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.0"
        inputMode="decimal"
        className="font-mono text-lg"
        aria-label={side === "buy" ? `Amount of ${CHAIN.currency} to spend` : `Amount of ${ticker} to sell`}
      />
      <p className="eyebrow mt-2">{side === "buy" ? CHAIN.currency : ticker}</p>

      <div className="grid grid-cols-4 gap-2 mt-4">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => setAmount(String(p))}
            className="numeral text-xs py-2 rounded-lg border-2 border-line-strong bg-surface text-fg-soft hover:border-accent hover:text-accent transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      <Button variant="accent" size="lg" className="w-full mt-5">
        {side === "buy" ? `Buy $${ticker}` : `Sell $${ticker}`}
      </Button>

      <p className="mt-4 text-xs text-fg-muted leading-relaxed">
        1% of this trade becomes a fee. Most of that is booked for {" "}
        <span className="text-fg">the account this coin names</span>, not for whoever opened it.
      </p>
    </div>
  );
}
