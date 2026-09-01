/*
 * Mock board. Shape-compatible with what a chain read would return, so
 * wiring wagmi later is a swap of this module's two exports rather than a
 * rewrite of every component.
 *
 * The handles are invented. Putting real creators on a demo board would
 * imply they had agreed to something, which is the one claim this product
 * must never make on anyone's behalf.
 */

export type Status = "unclaimed" | "claimed" | "graduated";

export type Coin = {
  address: string;
  ticker: string;
  name: string;
  blurb: string;
  handle: string;
  followers: number | null;
  verified: boolean;
  /* Null until the curve has taken a trade. */
  mcap: number | null;
  price: number | null;
  /* Extra cut the opener stacked on top, in percent. Goes to the account. */
  surcharge: number;
  /* Share of booked fees already pushed from the curve into the vault. */
  sweptPct: number;
  sweptEth: number;
  /* Sitting in the handle's vault right now. */
  waiting: number;
  status: Status;
  claimedBy?: string;
  openedBy: string;
  openedMinutesAgo: number;
  links: { tiktok?: string; x?: string; site?: string };
  /* Two-letter mark drawn when there is no artwork. */
  mark: string;
};

export const COINS: Coin[] = [
  {
    address: "0x8d46A10E90a4A08346cbA1963a1588e9682683c8",
    ticker: "LUMEN",
    name: "Lumen Kitchen",
    blurb: "Cooks an entire dinner service under one bare bulb. Never speaks.",
    handle: "@lumenkitchen",
    followers: 1_480_000,
    verified: true,
    mcap: 5_620,
    price: 0.00000561,
    surcharge: 1.2,
    sweptPct: 7,
    sweptEth: 0.279,
    waiting: 0.0165,
    status: "unclaimed",
    openedBy: "0xfC0184bE21c4a4d19f0cE0f4a7A5D2b1c7c58ECD",
    openedMinutesAgo: 9,
    links: { tiktok: "https://www.tiktok.com/@lumenkitchen", x: "https://x.com/lumenkitchen" },
    mark: "LK",
  },
  {
    address: "0x938CeEba1c61D83A82A743055e7cc3F5D564ceaF",
    ticker: "DRIFT",
    name: "Paolo Drifts",
    blurb: "Opened without his knowledge. Everything the curve books is his.",
    handle: "@paolo.drifts",
    followers: 12_900_000,
    verified: true,
    mcap: 4_130,
    price: 0.00000413,
    surcharge: 1.7,
    sweptPct: 0,
    sweptEth: 0,
    waiting: 0,
    status: "unclaimed",
    openedBy: "0xf6da39fF2b1c05e8A4dD1b7c9E0a3F51c8B2A440",
    openedMinutesAgo: 13,
    links: { tiktok: "https://www.tiktok.com/@paolo.drifts" },
    mark: "PD",
  },
  {
    address: "0x49D488c8257500348Df297b56f0459d6eb896b85",
    ticker: "NAN",
    name: "Nine Lives Nan",
    blurb: "Eighty-two, reviews energy drinks, has no idea any of this exists.",
    handle: "@nine.lives.nan",
    followers: 3_400_000,
    verified: false,
    mcap: null,
    price: null,
    surcharge: 1.7,
    sweptPct: 0,
    sweptEth: 0,
    waiting: 0,
    status: "unclaimed",
    openedBy: "0xf6da39fF2b1c05e8A4dD1b7c9E0a3F51c8B2A440",
    openedMinutesAgo: 16,
    links: { tiktok: "https://www.tiktok.com/@nine.lives.nan" },
    mark: "NN",
  },
  {
    address: "0x4B00D3adAD22c2CD937E76D8dffBe924dc617fa6",
    ticker: "MOTH",
    name: "Moth to Moth",
    blurb: "Films the same porch light every night. Two hundred nights so far.",
    handle: "@mothtomoth",
    followers: 74_000,
    verified: false,
    mcap: 1_180,
    price: 0.00000118,
    surcharge: 0,
    sweptPct: 12,
    sweptEth: 0.041,
    waiting: 0.0041,
    status: "unclaimed",
    openedBy: "0x2A9bB4e07f1D6c8a3E5F0b2C7d9A1e4F6B3c8D21",
    openedMinutesAgo: 184,
    links: { tiktok: "https://www.tiktok.com/@mothtomoth", site: "https://example.com" },
    mark: "MM",
  },
  {
    address: "0xe96a1cc6fd7bB0E229c4646aa1E216b1747A44b6",
    ticker: "QUIET",
    name: "Silent Gymrat",
    blurb: "Turned up eleven days after the coin opened and took the whole vault.",
    handle: "@silentgymrat",
    followers: 610_000,
    verified: true,
    mcap: 44_800,
    price: 0.0000448,
    surcharge: 2,
    sweptPct: 96,
    sweptEth: 1.07,
    waiting: 0.0186,
    status: "claimed",
    claimedBy: "0xf6da39fF2b1c05e8A4dD1b7c9E0a3F51c8B2A440",
    openedBy: "0xf6da39fF2b1c05e8A4dD1b7c9E0a3F51c8B2A440",
    openedMinutesAgo: 16_320,
    links: { tiktok: "https://www.tiktok.com/@silentgymrat", x: "https://x.com/silentgymrat" },
    mark: "SG",
  },
  {
    address: "0x71Ac3E9b0D4f2a6C8e1B5d7F3a9C0e2B4d6F8a13",
    ticker: "TAPE",
    name: "Tapeworm Tapes",
    blurb: "Graduated off the curve on day four. Fees still route to the handle.",
    handle: "@tapewormtapes",
    followers: 2_100_000,
    verified: true,
    mcap: 312_000,
    price: 0.000312,
    surcharge: 3.5,
    sweptPct: 100,
    sweptEth: 8.42,
    waiting: 0.914,
    status: "graduated",
    openedBy: "0x5cE1d8B3a7F2094c6E0b1D4a8C3f5E7b9A2d0C46",
    openedMinutesAgo: 8_640,
    links: { tiktok: "https://www.tiktok.com/@tapewormtapes" },
    mark: "TT",
  },
  {
    address: "0x3fB7c2A9e5D08146b3C7a0E9f2D4b6A8c1E5f739",
    ticker: "HUSH",
    name: "Hush Puppy Radio",
    blurb: "A dog station. Broadcasts nothing. Somebody thought it deserved a market.",
    handle: "@hushpuppyradio",
    followers: null,
    verified: false,
    mcap: null,
    price: null,
    surcharge: 0,
    sweptPct: 0,
    sweptEth: 0,
    waiting: 0,
    status: "unclaimed",
    openedBy: "0x9Dd0F4b2C8a1E6375B0c9D2e4A8f1C3b5E7d0A92",
    openedMinutesAgo: 2,
    links: { tiktok: "https://www.tiktok.com/@hushpuppyradio" },
    mark: "HP",
  },
];

export function boardStats() {
  const waiting = COINS.reduce((sum, c) => sum + (c.status === "claimed" ? 0 : c.waiting), 0);
  return {
    waiting,
    unclaimed: COINS.filter((c) => c.status === "unclaimed").length,
    opened: COINS.length,
  };
}

export function coinByAddress(address: string): Coin | undefined {
  return COINS.find((c) => c.address.toLowerCase() === address.toLowerCase());
}
