import type { Address } from "viem";

/**
 * The duel contract.
 *
 * ⚠️ PLACEHOLDER ABI — replace with your deployed arena before setting the
 * address. While NEXT_PUBLIC_ARENA_ADDRESS is unset the fight still resolves
 * locally so the game is playable and demoable, but nothing is wagered and
 * the UI says so rather than pretending a prize moved.
 */
export const ARENA_ADDRESS = (process.env.NEXT_PUBLIC_ARENA_ADDRESS ?? "") as Address | "";
export const ARENA_LIVE = /^0x[a-fA-F0-9]{40}$/.test(ARENA_ADDRESS);

export const ARENA_ABI = [
  {
    type: "function",
    name: "challenge",
    stateMutability: "nonpayable",
    inputs: [{ name: "opponent", type: "address" }],
    outputs: [{ name: "duelId", type: "uint256" }],
  },
] as const;

/* Share of the vault put up as the prize for a single duel. */
export const PRIZE_BPS = 500;

export const STARTING_HP = 100;

export type Blow = {
  /* Index of the fighter landing this blow: 0 challenger, 1 defender. */
  by: 0 | 1;
  damage: number;
  /* HP of both fighters after the blow. */
  hp: [number, number];
};

export type DuelResult = {
  blows: Blow[];
  winner: 0 | 1;
  seed: string;
};

function seedFrom(a: string, b: string, nonce: number): number {
  let h = 0x811c9dc5;
  const input = `${a.toLowerCase()}|${b.toLowerCase()}|${nonce}`;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Resolves a whole duel up front.
 *
 * Deliberately a fair coin at every exchange: holdings, fighter traits and
 * build number change nothing. A holdings-weighted fight would mean the
 * largest bag always wins, which turns the arena into a tax on everyone else
 * and kills the reason to press the button twice.
 */
export function resolveDuel(challenger: string, defender: string, nonce = 0): DuelResult {
  const seed = seedFrom(challenger, defender, nonce);
  const r = rng(seed);

  const hp: [number, number] = [STARTING_HP, STARTING_HP];
  const blows: Blow[] = [];

  while (hp[0] > 0 && hp[1] > 0) {
    const by: 0 | 1 = r() < 0.5 ? 0 : 1;
    const target = by === 0 ? 1 : 0;
    const damage = 14 + Math.floor(r() * 17);

    hp[target] = Math.max(0, hp[target] - damage);
    blows.push({ by, damage, hp: [hp[0], hp[1]] });
  }

  return {
    blows,
    winner: hp[0] > 0 ? 0 : 1,
    seed: `0x${seed.toString(16).padStart(8, "0")}`,
  };
}

/* Stand-in for the holder set a chain read would return. Addresses are
   invented; each one draws a different fighter because the traits come from
   the address itself. */
export const HOLDERS: { address: string; bag: number }[] = [
  { address: "0x8d46A10E90a4A08346cbA1963a1588e9682683c8", bag: 1_240_000 },
  { address: "0x938CeEba1c61D83A82A743055e7cc3F5D564ceaF", bag: 860_500 },
  { address: "0x49D488c8257500348Df297b56f0459d6eb896b85", bag: 402_000 },
  { address: "0x4B00D3adAD22c2CD937E76D8dffBe924dc617fa6", bag: 155_300 },
  { address: "0xe96a1cc6fd7bB0E229c4646aa1E216b1747A44b6", bag: 92_800 },
  { address: "0x71Ac3E9b0D4f2a6C8e1B5d7F3a9C0e2B4d6F8a13", bag: 41_600 },
];

/* Mock vault. Replace with a balance read once the arena is deployed. */
export const VAULT_ETH = 4.182;
