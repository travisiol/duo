import { defineChain } from "viem";

/**
 * Robinhood Chain network definition.
 *
 * Chain id 4663 is corroborated by two independent public sources. The RPC
 * and explorer URLs below are best-effort and MUST be re-verified against
 * the official docs before this app is pointed at real funds — override them
 * with the env vars rather than editing this file.
 *
 * Robinhood Chain reportedly has no native gas token: gas is paid in ETH.
 */
export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 4663);

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL ?? "https://rpc.mainnet.chain.robinhood.com";

const EXPLORER_URL =
  process.env.NEXT_PUBLIC_EXPLORER_URL ?? "https://robinhoodchain.blockscout.com";

export const robinhoodChain = defineChain({
  id: CHAIN_ID,
  name: "Robinhood Chain",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: [RPC_URL] } },
  blockExplorers: { default: { name: "Robinhood Chain Explorer", url: EXPLORER_URL } },
  testnet: false,
});
