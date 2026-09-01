import type { Address } from "viem";

/**
 * The pad contract.
 *
 * ⚠️ THE ABI BELOW IS A PLACEHOLDER SHAPE, NOT YOUR CONTRACT'S.
 *
 * Opening a coin is the one step that cannot be inferred from the front end:
 * it depends on the exact signature your factory exposes. Replace `PAD_ABI`
 * with the real ABI (and `openDuo` with the real function name) before
 * setting the address below — the argument list here is a guess at a
 * conventional shape, and a wrong ABI fails at simulation rather than
 * silently sending a bad transaction.
 *
 * While NEXT_PUBLIC_PAD_ADDRESS is unset the whole launch path stays
 * disabled and says so, so the app is safe to ship in this state.
 */
export const PAD_ADDRESS = (process.env.NEXT_PUBLIC_PAD_ADDRESS ?? "") as Address | "";

export const PAD_CONFIGURED = /^0x[a-fA-F0-9]{40}$/.test(PAD_ADDRESS);

/* Launch fee in ETH, charged by the curve. Override once confirmed. */
export const LAUNCH_FEE_ETH = process.env.NEXT_PUBLIC_LAUNCH_FEE_ETH ?? "0.0005";

export const PAD_ABI = [
  {
    type: "function",
    name: "openDuo",
    stateMutability: "payable",
    inputs: [
      { name: "handle", type: "string" },
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "tokenURI", type: "string" },
      /* Extra creator cut in basis points, on top of what the curve books.
         Goes to the account, never to the opener. */
      { name: "surchargeBps", type: "uint16" },
    ],
    outputs: [{ name: "coin", type: "address" }],
  },
] as const;
