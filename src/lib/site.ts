/*
 * The rename point. Everything the brand touches — wordmark, title tags,
 * footer, social — reads from here, so swapping DUO for Duetto, Encore or
 * Counterpoint is one edit rather than a search across twenty files.
 */
export const SITE = {
  name: "DUO",
  wordmark: "Duo",
  domain: "duo.fun",
  handle: "@duodotfun",
  social: "https://x.com/duodotfun",
  tagline: "A coin somebody opened in your name, earning while you were out.",
  /* The unit of the product. Used as a noun all over the copy: "open a duo". */
  unit: "duo",
  unitPlural: "duos",
} as const;

export const CHAIN = {
  name: "Robinhood Chain",
  id: 4663,
  currency: "ETH",
  symbol: "Ξ",
  explorer: "https://robinhoodchain.blockscout.com",
  curve: "Pons",
} as const;

/* Economics, stated once so the copy and the maths can never drift apart. */
export const FEES = {
  /* Every trade on the curve pays this. */
  tradeFee: 1,
  /* The curve keeps this share of the trade fee as protocol revenue. */
  curveShare: 30,
  /* What is left is booked to the coin as a creator fee. */
  creatorFee: 0.7,
  /* An opener may stack this much extra on top — it still goes to the account. */
  surchargeMax: 10,
  /* Taken at payout, not on the way in. */
  payoutCut: 10,
  /* Written into the contract, so the cut above can never quietly exceed it. */
  payoutCeiling: 20,
} as const;

export const CONTRACTS = [
  { label: `${SITE.wordmark} pad`, address: "0xf22ca9755973c8f4717425a629b6009a45035933" },
  { label: "Pons V2 factory", address: "0x7ed598bcef8bd9edd8c97a195c6d13f40801ec7e" },
  { label: "Pons fee escrow", address: "0xd3afeb2a57f70ef218aa82451c51b2fb0416ac9e" },
] as const;

export const NAV = [
  { href: "/", label: "The board" },
  { href: "/start", label: "Open one" },
  { href: "/claim", label: "Your half" },
  { href: "/how", label: "How it works" },
] as const;
