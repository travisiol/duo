import type { FighterTraits, Helm, Weapon } from "@/lib/fighter";

const INK = "var(--line-strong)";

/* Every part is drawn with the same 3px ink keyline and a flat fill, so a
   randomly assembled fighter still reads as one drawing rather than a pile of
   clip art. */
const stroke = {
  stroke: INK,
  strokeWidth: 3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function WeaponArt({ kind }: { kind: Weapon }) {
  /* All weapons are drawn around a hand at (0,0) and hang down-right. */
  switch (kind) {
    case "sword":
      return (
        <g {...stroke}>
          <line x1="0" y1="6" x2="0" y2="-46" />
          <path d="M-7 -46 L0 -58 L7 -46 Z" fill="var(--surface)" />
          <line x1="-9" y1="-8" x2="9" y2="-8" />
        </g>
      );
    case "axe":
      return (
        <g {...stroke}>
          <line x1="0" y1="8" x2="0" y2="-40" />
          <path d="M0 -38 q22 -4 20 16 q-14 6 -20 -4 Z" fill="var(--surface)" />
        </g>
      );
    case "hammer":
      return (
        <g {...stroke}>
          <line x1="0" y1="8" x2="0" y2="-38" />
          <rect x="-13" y="-52" width="26" height="16" rx="3" fill="var(--surface)" />
        </g>
      );
    case "spear":
      return (
        <g {...stroke}>
          <line x1="0" y1="18" x2="0" y2="-56" />
          <path d="M-6 -56 L0 -72 L6 -56 Z" fill="var(--surface)" />
        </g>
      );
    case "dagger":
      return (
        <g {...stroke}>
          <line x1="0" y1="4" x2="0" y2="-24" />
          <path d="M-5 -24 L0 -34 L5 -24 Z" fill="var(--surface)" />
          <line x1="-7" y1="-6" x2="7" y2="-6" />
        </g>
      );
    case "scythe":
      return (
        <g {...stroke}>
          <line x1="0" y1="10" x2="0" y2="-50" />
          <path d="M0 -50 q24 2 26 22" fill="none" />
        </g>
      );
  }
}

function HelmArt({ kind, body }: { kind: Helm; body: string }) {
  switch (kind) {
    case "horned":
      return (
        <g {...stroke}>
          <path d="M32 26 q18 -12 36 0" fill={body} />
          <path d="M32 24 q-9 -9 -3 -16 q7 4 8 13" fill="var(--surface)" />
          <path d="M68 24 q9 -9 3 -16 q-7 4 -8 13" fill="var(--surface)" />
        </g>
      );
    case "plumed":
      return (
        <g {...stroke}>
          <path d="M32 26 q18 -12 36 0" fill={body} />
          <path d="M50 14 q4 -16 -6 -22" fill="none" />
        </g>
      );
    case "hood":
      return (
        <g {...stroke}>
          <path d="M28 40 q0 -30 22 -30 q22 0 22 30 q-10 -12 -22 -12 q-12 0 -22 12" fill={body} />
        </g>
      );
    case "crown":
      return (
        <g {...stroke}>
          <path d="M33 22 L33 8 L41 16 L50 5 L59 16 L67 8 L67 22 Z" fill="var(--surface)" />
        </g>
      );
    case "none":
      return null;
  }
}

function Eyes({ face }: { face: FighterTraits["face"] }) {
  const eye = { fill: INK };
  switch (face) {
    case "angry":
      return (
        <g>
          <path d="M40 28 l8 4 M60 28 l-8 4" {...stroke} strokeWidth={3} />
          <circle cx="43" cy="36" r="3" {...eye} />
          <circle cx="57" cy="36" r="3" {...eye} />
        </g>
      );
    case "wild":
      return (
        <g>
          <circle cx="43" cy="34" r="6" fill="var(--surface)" stroke={INK} strokeWidth={2.5} />
          <circle cx="57" cy="34" r="6" fill="var(--surface)" stroke={INK} strokeWidth={2.5} />
          <circle cx="44" cy="35" r="2.5" {...eye} />
          <circle cx="56" cy="33" r="2.5" {...eye} />
        </g>
      );
    case "dead-eyed":
      return (
        <g {...stroke} strokeWidth={3.5}>
          <line x1="39" y1="30" x2="47" y2="38" />
          <line x1="47" y1="30" x2="39" y2="38" />
          <line x1="53" y1="30" x2="61" y2="38" />
          <line x1="61" y1="30" x2="53" y2="38" />
        </g>
      );
    case "calm":
      return (
        <g>
          <circle cx="43" cy="34" r="3.5" {...eye} />
          <circle cx="57" cy="34" r="3.5" {...eye} />
        </g>
      );
  }
}

export function Fighter({
  traits,
  flip,
  className,
}: {
  traits: FighterTraits;
  flip?: boolean;
  className?: string;
}) {
  const { body, cloth, cape, shield, weapon, helm, face, name } = traits;

  return (
    <svg
      viewBox="0 0 100 132"
      /* The mirror is a class, not an inline style: an inline transform would
         outrank every animation and knock-down state in the cascade. */
      className={`${flip ? "flipped " : ""}${className ?? ""}`}
      role="img"
      aria-label={`${name}, carrying a ${weapon}`}
    >
      {cape && (
        <path
          d="M34 52 q-16 26 -10 54 l42 0 q6 -28 -10 -54 Z"
          fill={cape}
          {...stroke}
          opacity={0.95}
        />
      )}

      {/* legs */}
      <g {...stroke}>
        <line x1="42" y1="92" x2="42" y2="120" strokeWidth={9} />
        <line x1="58" y1="92" x2="58" y2="120" strokeWidth={9} />
      </g>

      {/* torso */}
      <rect x="33" y="50" width="34" height="44" rx="9" fill={cloth} {...stroke} />
      <path d="M33 66 q17 8 34 0" fill="none" {...stroke} strokeWidth={2.5} />

      {/* arms — the right one carries the weapon, so it is drawn last */}
      <line x1="35" y1="60" x2="20" y2="80" {...stroke} strokeWidth={8} />
      {shield && (
        <g {...stroke}>
          <ellipse cx="18" cy="84" rx="13" ry="16" fill={body} />
          <circle cx="18" cy="84" r="4" fill="var(--surface)" />
        </g>
      )}

      {/* head */}
      <circle cx="50" cy="34" r="18" fill={body} {...stroke} />
      <Eyes face={face} />
      <HelmArt kind={helm} body={body} />

      <line x1="65" y1="60" x2="80" y2="76" {...stroke} strokeWidth={8} />
      <g transform="translate(80 76)">
        <WeaponArt kind={weapon} />
      </g>
    </svg>
  );
}
