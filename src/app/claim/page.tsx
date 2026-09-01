import type { Metadata } from "next";
import { ClaimFlow } from "@/components/ClaimFlow";

export const metadata: Metadata = {
  title: "Your half",
  description: "Prove the account is yours and the vault pays out to any wallet you name.",
};

export default function ClaimPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 pt-16 sm:pt-24">
      <p className="eyebrow">Step two. The one only you can do.</p>
      <h1 className="display text-[clamp(2.25rem,5.4vw,3.75rem)] mt-5">Take your half</h1>
      <p className="mt-6 mb-12 text-base text-fg-soft leading-relaxed">
        If somebody opened a coin in your name, the fees have been collecting in a vault with your
        handle baked into its address. Prove the account is yours and it pays out to any wallet you
        name.
      </p>

      <ClaimFlow />
    </div>
  );
}
