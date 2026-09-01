import type { Metadata } from "next";
import { StartForm } from "@/components/StartForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Open a ${SITE.unit}`,
  description: `Pick a TikTok account, name the coin, launch it. Its fees are held for that account from the first trade.`,
};

export default function StartPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-16 sm:pt-24">
      <p className="eyebrow">Step one of two. They do step two.</p>
      <h1 className="display text-[clamp(2.25rem,5.4vw,3.75rem)] mt-5">Open a {SITE.unit}</h1>
      <p className="mt-6 mb-12 text-base text-fg-soft leading-relaxed max-w-xl">
        Pick an account, name the coin, launch it. From the first trade onward its creator fees are
        held for that account. You cannot route them anywhere else, and neither can we.
      </p>

      <StartForm />
    </div>
  );
}
