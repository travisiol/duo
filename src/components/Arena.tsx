"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAccount } from "wagmi";
import clsx from "clsx";
import { fighterFor } from "@/lib/fighter";
import {
  ARENA_LIVE,
  HOLDERS,
  PRIZE_BPS,
  STARTING_HP,
  VAULT_ETH,
  resolveDuel,
  type DuelResult,
} from "@/lib/duel";
import { eth, shortAddress } from "@/lib/format";
import { Fighter } from "./Fighter";
import { WalletConnect } from "./WalletConnect";
import { Button } from "./ui/Button";

/* Shown before a wallet arrives so the page is never an empty promise — a
   real fighter, drawn from a fixed address, captioned as somebody else's. */
const DEMO_ADDRESS = "0x5cE1d8B3a7F2094c6E0b1D4a8C3f5E7b9A2d0C46";

const BLOW_MS = 780;

type Phase = "idle" | "fighting" | "done";

function HealthBar({ hp, flip }: { hp: number; flip?: boolean }) {
  const pct = Math.max(0, (hp / STARTING_HP) * 100);
  return (
    <div className="w-full">
      <div
        className={clsx(
          "h-4 border-2 border-line-strong rounded-full overflow-hidden bg-surface flex",
          flip && "justify-end",
        )}
      >
        <div
          className={clsx(
            "h-full transition-[width] duration-300 ease-out",
            pct > 50 ? "bg-gain" : pct > 25 ? "bg-accent" : "bg-loss",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className={clsx("numeral text-xs mt-1.5", flip && "text-right")}>{hp} HP</p>
    </div>
  );
}

export function Arena() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { address, isConnected } = useAccount();
  const me = mounted && isConnected && address ? address : null;

  const roster = useMemo(
    () => HOLDERS.filter((h) => h.address.toLowerCase() !== me?.toLowerCase()),
    [me],
  );

  const [opponent, setOpponent] = useState(roster[0]?.address ?? HOLDERS[0].address);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<DuelResult | null>(null);
  const [step, setStep] = useState(-1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const myAddress = me ?? DEMO_ADDRESS;
  const mine = useMemo(() => fighterFor(myAddress), [myAddress]);
  const theirs = useMemo(() => fighterFor(opponent), [opponent]);

  const prize = (VAULT_ETH * PRIZE_BPS) / 10_000;

  /* Blows already played decide the bars; the fight itself was decided the
     moment the button was pressed. */
  const hp: [number, number] =
    result && step >= 0 && result.blows[step]
      ? result.blows[step].hp
      : [STARTING_HP, STARTING_HP];

  /* Blow animations belong to the fight and nothing else. Leaving the last
     blow's classes on after the bell would outrank the knock-down state, and
     the loser would fade without ever falling over. */
  const current = phase === "fighting" && result && step >= 0 ? result.blows[step] : null;

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  function fight() {
    clearTimers();
    const duel = resolveDuel(myAddress, opponent, Date.now() % 100_000);
    setResult(duel);
    setPhase("fighting");
    setStep(-1);

    duel.blows.forEach((_, i) => {
      timers.current.push(setTimeout(() => setStep(i), BLOW_MS * (i + 1)));
    });
    timers.current.push(
      setTimeout(() => setPhase("done"), BLOW_MS * (duel.blows.length + 1)),
    );
  }

  function reset() {
    clearTimers();
    setPhase("idle");
    setResult(null);
    setStep(-1);
  }

  const iWon = result?.winner === 0;

  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8 pb-20">
      {/* ---- the arena ---------------------------------------------------- */}
      <section
        className={clsx(
          "card mt-8 p-6 sm:p-10 relative overflow-hidden",
          current && "duel-shake",
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="eyebrow truncate">{me ? "You" : "A stranger"}</p>
            <p className="display text-xl sm:text-2xl truncate">{mine.name}</p>
          </div>
          <p className="eyebrow shrink-0 pt-1">vs</p>
          <div className="flex-1 min-w-0 text-right">
            <p className="eyebrow truncate">{shortAddress(opponent)}</p>
            <p className="display text-xl sm:text-2xl truncate">{theirs.name}</p>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-4">
          <HealthBar hp={hp[0]} />
          <HealthBar hp={hp[1]} flip />
        </div>

        <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-end gap-2 sm:gap-6">
          <Fighter
            traits={mine}
            className={clsx(
              "w-full max-w-[150px] justify-self-center h-auto transition-transform",
              current?.by === 0 && "lunge-right",
              current?.by === 1 && "took-hit",
              phase === "done" && !iWon && "defeated",
            )}
          />

          <div className="pb-10 text-center min-w-[3.5rem]">
            {current ? (
              <span className="display text-2xl sm:text-3xl text-loss blow-pop">
                −{current.damage}
              </span>
            ) : (
              <span className="eyebrow">{phase === "idle" ? "ready" : ""}</span>
            )}
          </div>

          <Fighter
            traits={theirs}
            flip
            className={clsx(
              "w-full max-w-[150px] justify-self-center h-auto transition-transform",
              current?.by === 1 && "lunge-left",
              current?.by === 0 && "took-hit",
              phase === "done" && iWon && "defeated",
            )}
          />
        </div>

        {/* ---- outcome ---------------------------------------------------- */}
        {phase === "done" && result && (
          <div className="mt-8 pt-6 border-t-2 border-line text-center">
            <p className="display text-3xl sm:text-4xl">
              {iWon ? (
                <>
                  {mine.name} <span className="text-accent">wins</span>
                </>
              ) : (
                <>
                  {theirs.name} <span className="text-loss">wins</span>
                </>
              )}
            </p>
            <p className="mt-3 text-sm text-fg-soft">
              {me ? (
                <>
                  Takes <span className="numeral text-accent">{eth(prize, 4)}</span>
                  {iWon ? " out of the vault." : " — you get nothing."}
                </>
              ) : (
                <>An exhibition bout. Connect a wallet to fight as yourself, for the real purse.</>
              )}
            </p>
            <p className="eyebrow mt-3">
              seed {result.seed} · {result.blows.length} blows
            </p>
            <Button variant="outline" className="mt-6" onClick={reset}>
              Again
            </Button>
          </div>
        )}

        {phase === "idle" && (
          <div className="mt-8 pt-6 border-t-2 border-line flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="eyebrow">{me ? "Prize this round" : "Prize once you are in"}</p>
              <p className="numeral text-2xl text-accent mt-1">{eth(prize, 4)}</p>
            </div>
            {/* A visitor with no wallet can still watch a bout. Gating the
                only interesting thing on the page behind a connect prompt is
                how a one-pager dies before anyone shares it. */}
            <div className="flex items-center gap-3">
              {mounted && !isConnected && <WalletConnect />}
              <Button variant="accent" size="lg" onClick={fight} disabled={!mounted}>
                {me ? `Fight ${theirs.name}` : "Watch a bout"}
              </Button>
            </div>
          </div>
        )}

        {phase === "fighting" && (
          <p className="eyebrow text-center mt-8 pt-6 border-t-2 border-line">fighting…</p>
        )}
      </section>

      {/* ---- who else is holding ------------------------------------------ */}
      <section className="mt-10">
        <div className="flex items-baseline justify-between gap-4 mb-4">
          <h2 className="display text-2xl">Pick a fight</h2>
          <p className="eyebrow">{roster.length} holders</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {roster.map((h) => {
            const f = fighterFor(h.address);
            const active = h.address === opponent;
            return (
              <button
                key={h.address}
                onClick={() => {
                  reset();
                  setOpponent(h.address);
                }}
                disabled={phase === "fighting"}
                className={clsx(
                  "card p-4 flex items-center gap-3 text-left transition-all disabled:opacity-50",
                  active && "picked",
                )}
              >
                <Fighter traits={f} className="w-12 h-auto shrink-0" />
                <div className="min-w-0">
                  <p className="display text-base truncate">{f.name}</p>
                  <p className="numeral text-xs text-fg-muted truncate">
                    {shortAddress(h.address)}
                  </p>
                  <p className="eyebrow mt-0.5">{(h.bag / 1000).toFixed(0)}K held</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {!ARENA_LIVE && (
        <p className="mt-10 text-xs text-fg-muted leading-relaxed text-center max-w-lg mx-auto">
          The arena contract is not deployed yet, so fights resolve in your browser and no prize
          actually moves. Set <span className="numeral text-fg">NEXT_PUBLIC_ARENA_ADDRESS</span> and
          swap the placeholder ABI in <span className="numeral text-fg">src/lib/duel.ts</span> to
          play for the real vault.
        </p>
      )}
    </div>
  );
}
