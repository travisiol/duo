/*
 * The rename point. Everything the brand touches reads from here, so swapping
 * DUETTO for another name is one edit rather than a search across the app.
 */
export const SITE = {
  name: "DUETTO",
  wordmark: "Duetto",
  domain: "duetto.fun",
  handle: "@duettodotfun",
  social: "https://x.com/duettodotfun",
  tagline: "Your wallet is your fighter. Beat another holder, take the vault.",
} as const;

export const CHAIN = {
  name: "Robinhood Chain",
  id: 4663,
  currency: "ETH",
  symbol: "Ξ",
  explorer: "https://robinhoodchain.blockscout.com",
} as const;

export const TOKEN = {
  ticker: "DUET",
  /* Share of every trade that falls into the vault the duels pay out of. */
  tradeFeeBps: 100,
} as const;
