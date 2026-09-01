import { CHAIN } from "./site";

/* Money on the board is read at a glance, so it is always short and always
   the same width class: $5.6K, not $5,612.40. */
export function usd(n: number | null): string {
  if (n === null || Number.isNaN(n)) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

/* Curve prices run to five leading zeros. Writing them out makes every row a
   different width and none of them legible, so the zero run is subscripted
   the way exchanges do it: $0.0₅561. */
const SUBS = "₀₁₂₃₄₅₆₇₈₉";

export function price(n: number | null): string {
  if (n === null || n === 0) return "—";
  if (n >= 0.01) return `$${n.toFixed(4)}`;
  const exp = Math.floor(Math.log10(n));
  /* Three significant digits, read off the mantissa rather than the raw
     number — scaling the number itself loses them to floating point. */
  let digits = Math.round((n / 10 ** exp) * 100);
  let zeros = -exp - 1;
  /* 0.000999… rounds up to a 4-digit mantissa and gains a decade with it. */
  if (digits >= 1000) {
    digits = Math.round(digits / 10);
    zeros -= 1;
  }
  if (zeros < 1) return `$${n.toPrecision(3)}`;
  const sub = zeros
    .toString()
    .split("")
    .map((d) => SUBS[Number(d)])
    .join("");
  return `$0.0${sub}${digits}`;
}

export function eth(n: number, places = 4): string {
  if (n === 0) return `0 ${CHAIN.symbol}`;
  return `${n.toFixed(places).replace(/0+$/, "").replace(/\.$/, "")} ${CHAIN.symbol}`;
}

export function shortAddress(a: string): string {
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export function followers(n: number | null): string {
  if (n === null) return "";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M followers`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K followers`;
  return `${n} followers`;
}

export function ago(minutes: number): string {
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / (60 * 24))}d ago`;
}
