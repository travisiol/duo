"use client";

import { useEffect, useMemo, useState } from "react";
import { parseEther } from "viem";
import { useAccount, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { CHAIN, FEES, SITE } from "@/lib/site";
import { CHAIN_ID, robinhoodChain } from "@/lib/chain";
import { LAUNCH_FEE_ETH, PAD_ABI, PAD_ADDRESS, PAD_CONFIGURED } from "@/lib/pad";
import { ART_UPLOAD_CONFIGURED, uploadArt } from "@/lib/art";
import { ImageDrop, type CoinArt } from "./ImageDrop";
import { WalletConnect } from "./WalletConnect";
import { Button } from "./ui/Button";
import { Input, Labelled } from "./ui/Field";

const HANDLE_RE = /^[a-zA-Z0-9._]{2,24}$/;
const TICKER_RE = /^[A-Z0-9]{2,8}$/;

export function StartForm() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [handle, setHandle] = useState("");
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [surcharge, setSurcharge] = useState(0);
  const [art, setArt] = useState<CoinArt | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const { isConnected, chainId } = useAccount();
  const { switchChain, isPending: switching } = useSwitchChain();
  const { writeContractAsync, data: hash, isPending: signing, reset } = useWriteContract();
  const { isLoading: confirming, isSuccess: done } = useWaitForTransactionReceipt({ hash });

  const theirCut = FEES.creatorFee + surcharge;
  const wrongChain = isConnected && chainId !== CHAIN_ID;

  const invalid = useMemo(() => {
    if (!HANDLE_RE.test(handle)) return "Enter the TikTok handle you are opening this for.";
    if (name.trim().length < 1) return "Give the coin a name.";
    if (!TICKER_RE.test(ticker)) return "Tickers are 2–8 letters or digits.";
    return null;
  }, [handle, name, ticker]);

  async function open() {
    setProblem(null);
    if (invalid) return setProblem(invalid);

    setBusy(true);
    try {
      /* Art is optional. If one was picked it has to become a real URL first —
         a base64 data URL is far too large to travel as calldata. */
      let tokenURI = "";
      if (art) {
        if (!ART_UPLOAD_CONFIGURED) {
          throw new Error(
            "Coin art needs an upload endpoint before it can be launched. Remove the image to open without art.",
          );
        }
        tokenURI = await uploadArt(art);
      }

      await writeContractAsync({
        address: PAD_ADDRESS as `0x${string}`,
        abi: PAD_ABI,
        functionName: "openDuo",
        args: [handle.toLowerCase(), name.trim(), ticker, tokenURI, Math.round(surcharge * 100)],
        value: parseEther(LAUNCH_FEE_ETH),
        chainId: CHAIN_ID,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "That did not go through.";
      /* A wallet rejection is a choice, not a failure worth shouting about. */
      setProblem(/user rejected|denied/i.test(msg) ? "You cancelled it." : msg);
    } finally {
      setBusy(false);
    }
  }

  const pending = signing || confirming || busy;

  function launchControl() {
    if (!mounted) {
      return (
        <Button variant="accent" size="lg" className="w-full" disabled>
          Open the {SITE.unit}
        </Button>
      );
    }
    if (!isConnected) return <WalletConnect size="lg" />;
    if (wrongChain) {
      return (
        <Button
          variant="accent"
          size="lg"
          className="w-full"
          onClick={() => switchChain({ chainId: CHAIN_ID })}
          disabled={switching}
        >
          {switching ? "Switching…" : `Switch to ${CHAIN.name}`}
        </Button>
      );
    }
    return (
      <Button
        variant="accent"
        size="lg"
        className="w-full"
        onClick={open}
        disabled={pending || !PAD_CONFIGURED || Boolean(invalid)}
      >
        {signing ? "Check wallet…" : confirming ? "Confirming…" : `Open the ${SITE.unit}`}
      </Button>
    );
  }

  if (done && hash) {
    return (
      <div className="card p-8 text-center">
        <p className="eyebrow">Opened</p>
        <h2 className="display text-3xl mt-3">
          ${ticker} is live for @{handle}
        </h2>
        <p className="mt-4 text-sm text-fg-soft max-w-md mx-auto leading-relaxed">
          From the next trade onward its fees collect in a vault keyed to that handle. You cannot
          reach them, and neither can we.
        </p>
        <a
          href={`${robinhoodChain.blockExplorers.default.url}/tx/${hash}`}
          target="_blank"
          rel="noreferrer noopener"
          className="numeral text-xs text-accent hover:underline block mt-5 break-all"
        >
          {hash}
        </a>
        <Button
          variant="outline"
          className="mt-7"
          onClick={() => {
            reset();
            setHandle("");
            setName("");
            setTicker("");
            setArt(null);
            setSurcharge(0);
          }}
        >
          Open another
        </Button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
      <form className="card p-6 sm:p-8 space-y-8" onSubmit={(e) => e.preventDefault()}>
        <Labelled
          label="Whose coin is this?"
          hint="Any public TikTok account. They do not need to know yet."
        >
          <div className="flex items-stretch">
            <span className="numeral text-sm text-fg-muted border-2 border-r-0 border-line-strong rounded-l-[11px] bg-surface px-3.5 flex items-center">
              @
            </span>
            <Input
              value={handle}
              onChange={(e) => setHandle(e.target.value.replace(/^@/, ""))}
              placeholder="handle"
              className="font-mono rounded-l-none"
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

        <Labelled label="Coin art" hint="Optional. Square images read best.">
          <ImageDrop art={art} onChange={setArt} />
          {art && !ART_UPLOAD_CONFIGURED && (
            <p className="mt-2 text-xs text-loss leading-relaxed">
              Art is previewing locally only — no upload endpoint is configured, so this coin cannot
              be launched with an image yet.
            </p>
          )}
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

        {launchControl()}

        {mounted && isConnected && !wrongChain && !PAD_CONFIGURED && (
          <p className="text-xs text-fg-muted leading-relaxed -mt-4">
            The pad contract is not deployed yet. Set{" "}
            <span className="numeral text-fg">NEXT_PUBLIC_PAD_ADDRESS</span> and swap the placeholder
            ABI in <span className="numeral text-fg">src/lib/pad.ts</span> to enable launching.
          </p>
        )}

        {problem && <p className="text-xs text-loss leading-relaxed -mt-4">{problem}</p>}
        {!problem && invalid && mounted && isConnected && (
          <p className="text-xs text-fg-muted -mt-4">{invalid}</p>
        )}
      </form>

      <aside className="space-y-5 lg:sticky lg:top-24">
        {/* The two halves, live. Yours stays plain; theirs is the only thing on
            the page that gets the accent. */}
        <div className="card overflow-hidden">
          <div className="p-5 border-b-2 border-line-strong">
            <p className="eyebrow mb-3">Your half</p>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg border-2 border-line-strong flex items-center justify-center overflow-hidden">
                {art ? (
                  // eslint-disable-next-line @next/next/no-img-element -- local data URL
                  <img src={art.dataUrl} alt="" className="size-full object-cover" />
                ) : (
                  <span className="numeral text-xs text-fg-muted">
                    {ticker ? ticker.slice(0, 2) : "?"}
                  </span>
                )}
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
              <div className="size-10 rounded-lg border-2 border-dashed border-accent flex items-center justify-center">
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
              [`${CHAIN.curve} launch fee`, `${LAUNCH_FEE_ETH} ${CHAIN.currency}`],
              ["Your surcharge", `0 ${CHAIN.currency}`],
              ["Gas", "a fraction of a cent"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="text-fg-soft">{k}</dt>
                <dd className="numeral text-fg-soft">{v}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-4 pt-3 border-t-2 border-dashed border-line">
              <dt className="text-fg">Total</dt>
              <dd className="numeral text-accent">
                {LAUNCH_FEE_ETH} {CHAIN.currency}
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
            cannot withdraw from it and neither can we — {SITE.wordmark} takes {FEES.payoutCut}% only
            when it pays out.
          </p>
        </div>
      </aside>
    </div>
  );
}
