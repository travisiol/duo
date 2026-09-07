import { CHAIN } from "./site";

export function eth(n: number, places = 4): string {
  if (n === 0) return `0 ${CHAIN.symbol}`;
  return `${n.toFixed(places).replace(/0+$/, "").replace(/\.$/, "")} ${CHAIN.symbol}`;
}

export function shortAddress(a: string): string {
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}
