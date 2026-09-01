"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import clsx from "clsx";
import { CHAIN, FEES, SITE } from "@/lib/site";
import { COINS } from "@/lib/coins";
import { eth } from "@/lib/format";
import { Button } from "./ui/Button";
import { WalletConnect } from "./WalletConnect";
import { Input } from "./ui/Field";

type Found = { handle: string; waiting: number; coins: number } | null;

function Step({
  n,
  title,
  children,
  dim,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
  dim?: boolean;
}) {
  return (
    <section className={clsx("card p-6 sm:p-8 transition-opacity", dim && "opacity-45")}>
      <p className="eyebrow mb-5">
        {n} · {title}
      </p>
      {children}
    </section>
  );
}

export function ClaimFlow() {
  const [handle, setHandle] = useState("");
  const [found, setFound] = useState<Found>(null);
  const [searched, setSearched] = useState(false);
  const [route, setRoute] = useState<"bio" | "caption">("bio");

  const { address, isConnected } = useAccount();
  const ready = Boolean(found) && isConnected;

  /* Stands in for the chain read. The vault address is a pure function of the
     handle, so a lookup never needs a wallet or a login. */
  function look() {
    const key = handle.trim().replace(/^@/, "").toLowerCase();
    setSearched(true);
    if (!key) return setFound(null);

    const matches = COINS.filter((c) => c.handle.replace(/^@/, "").toLowerCase() === key);
    setFound(
      matches.length
        ? {
            handle: key,
            waiting: matches.reduce((s, c) => s + c.waiting, 0),
            coins: matches.length,
          }
        : null,
    );
  }

  /* Derived from the handle and the wallet together — that pairing is the
     whole point, so no address means no code. */
  const code =
    found && address
      ? `${SITE.name.toLowerCase()}-${found.handle.slice(0, 4)}-${address.slice(2, 8).toLowerCase()}`
      : "";

  return (
    <div className="space-y-5">
      <Step n={1} title="Your TikTok">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-stretch flex-1">
            <span className="numeral text-sm text-fg-muted border border-r-0 border-line px-3.5 flex items-center">
              @
            </span>
            <Input
              value={handle}
              onChange={(e) => setHandle(e.target.value.replace(/^@/, ""))}
              onKeyDown={(e) => e.key === "Enter" && look()}
              placeholder="handle"
              className="font-mono"
            />
          </div>
          <Button variant="accent" onClick={look}>
            Look
          </Button>
        </div>
        <p className="mt-3 text-xs text-fg-muted">
          Type a handle to see whether anything is waiting. No wallet needed for this part.
        </p>

        {searched && (
          <div
            className={clsx(
              "mt-6 p-5 border",
              found ? "border-accent-line bg-accent/5" : "border-line bg-page",
            )}
          >
            {found ? (
              <>
                <p className="eyebrow mb-2">Waiting for @{found.handle}</p>
                <p className="numeral text-3xl text-accent">{eth(found.waiting, 4)}</p>
                <p className="text-xs text-fg-soft mt-3">
                  across {found.coins} {found.coins === 1 ? "coin" : "coins"} · yours once you prove
                  the account, less the {FEES.payoutCut}% {SITE.wordmark} takes at payout
                </p>
              </>
            ) : (
              <p className="text-sm text-fg-soft">
                Nothing is open for that handle yet. Nobody has to ask you first — if one appears
                later, the vault will already have your handle in its address.
              </p>
            )}
          </div>
        )}
      </Step>

      <Step n={2} title="The wallet you want paid" dim={!found}>
        <p className="text-sm text-fg-soft leading-relaxed mb-5">
          Connect it and sign one sentence. Free, no transaction — it proves the address is yours as
          well as the account.
        </p>
        {found ? (
          <WalletConnect />
        ) : (
          <Button variant="outline" disabled>
            Connect wallet
          </Button>
        )}
      </Step>

      <Step n={3} title="Prove the account" dim={!ready}>
        <p className="text-sm text-fg-soft leading-relaxed">
          Your code is derived from the handle <em className="not-italic text-fg">and</em> that
          wallet together. A code tied only to a handle could be copied out of your bio and replayed
          from somebody else&rsquo;s address; this one matches nobody but you.
        </p>

        <div className="mt-5 flex items-center justify-between gap-4 border border-dashed border-line px-4 py-3.5">
          <span className="numeral text-sm text-accent break-all">
            {code || "connect a wallet to generate"}
          </span>
          <button
            className="eyebrow hover:text-fg transition-colors shrink-0"
            disabled={!ready}
          >
            copy
          </button>
        </div>

        <div className="mt-6 flex gap-1">
          {(["bio", "caption"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoute(r)}
              disabled={!ready}
              className={clsx(
                "eyebrow px-3.5 py-2 rounded-lg border-2 transition-colors",
                route === r ? "border-accent text-accent" : "border-line hover:text-fg-soft",
              )}
            >
              {r === "bio" ? "In your bio" : "In a caption"}
            </button>
          ))}
        </div>

        <p className="mt-5 text-sm text-fg-soft leading-relaxed">
          {route === "bio"
            ? "Paste the code into your bio, press verify, then delete it again. We read the public profile once and store none of it."
            : "Post anything with the code in the caption and paste the link here. This route goes through TikTok's own oEmbed endpoint, which answers for everyone — so it still works when a profile read is refused."}
        </p>

        {route === "caption" && (
          <Input className="mt-4" placeholder="https://www.tiktok.com/@you/video/…" disabled={!ready} />
        )}

        <Button variant="accent" className="mt-6 w-full sm:w-auto" disabled={!ready}>
          Verify and claim
        </Button>
      </Step>

      <aside className="card-quiet p-6">
        <p className="eyebrow mb-3">Why a code and not a login</p>
        <p className="text-sm text-fg-soft leading-relaxed">
          A TikTok login would tell us your account name and nothing whatsoever about your wallet.
          A code that matches this handle and this address, placed where only the account holder can
          place it, proves both at once — and it works on {CHAIN.name} without us holding an account
          of yours at all.
        </p>
      </aside>
    </div>
  );
}
