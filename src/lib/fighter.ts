/*
 * Your fighter is your address.
 *
 * Nothing is chosen and nothing is stored: every trait is derived from the
 * wallet itself, so two people can never share a fighter, nobody can reroll
 * into a better one, and the same address draws identically on every device
 * forever. It also means there is no character-creation screen to sit between
 * arriving and fighting — which is the whole point of a one-page game.
 */

const WEAPONS = ["sword", "axe", "hammer", "spear", "dagger", "scythe"] as const;
const HELMS = ["none", "horned", "plumed", "hood", "crown"] as const;
const FACES = ["calm", "angry", "wild", "dead-eyed"] as const;

export type Weapon = (typeof WEAPONS)[number];
export type Helm = (typeof HELMS)[number];
export type Face = (typeof FACES)[number];

/* Flat, saturated, and all legible on warm paper behind a 2px ink keyline. */
const BODIES = [
  "#6b4eff", "#ff4d8d", "#12915a", "#d93a45", "#f0a020",
  "#2a9df4", "#8b5cf6", "#e2582a", "#0f9b8e", "#c026a3",
];

const CLOTH = ["#14121a", "#3d3654", "#7a2d3f", "#1f4d3d", "#4a3a1a", "#2b3a63"];

const FIRST = [
  "Grim", "Vast", "Iron", "Pale", "Quick", "Salt", "Bright", "Low",
  "Mad", "Thin", "Old", "Red", "Sly", "Bone", "Glass", "Storm",
];

const SECOND = [
  "hand", "tooth", "walker", "wing", "jaw", "step", "howl", "crow",
  "spine", "gale", "brand", "thorn", "wick", "mourn", "vein", "harrow",
];

/* FNV-1a. Small, dependency-free, and spreads adjacent addresses apart —
   which matters because real wallets often share long prefixes. */
function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/* mulberry32 — one seed in, a stable stream of traits out. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type FighterTraits = {
  address: string;
  name: string;
  body: string;
  cloth: string;
  weapon: Weapon;
  helm: Helm;
  face: Face;
  cape: string | null;
  shield: boolean;
  /* Cosmetic only — shown as a record, never as an edge in a fight. */
  build: number;
};

export function fighterFor(address: string): FighterTraits {
  const seed = hash(address.toLowerCase());
  const r = rng(seed);
  const pick = <T,>(xs: readonly T[]): T => xs[Math.floor(r() * xs.length)];

  const body = pick(BODIES);

  return {
    address,
    name: `${pick(FIRST)}${pick(SECOND)}`,
    body,
    cloth: pick(CLOTH),
    weapon: pick(WEAPONS),
    helm: pick(HELMS),
    face: pick(FACES),
    cape: r() > 0.55 ? pick(BODIES.filter((c) => c !== body)) : null,
    shield: r() > 0.6,
    build: 1 + Math.floor(r() * 99),
  };
}
