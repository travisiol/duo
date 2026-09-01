import { SITE } from "@/lib/site";

/* Two voices: one drawn, one still an outline. The mark is the product
   argument in 24 pixels — a pair where only half has arrived. */
export function Wordmark({ size = 22 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="8" cy="12" r="6.25" stroke="currentColor" strokeWidth="1.4" />
        <circle
          cx="16"
          cy="12"
          r="6.25"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeDasharray="2.2 2.4"
          opacity="0.55"
        />
      </svg>
      <span className="display text-[1.35rem] tracking-tight">{SITE.wordmark}</span>
    </span>
  );
}
