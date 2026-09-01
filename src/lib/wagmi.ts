import { createConfig, http, injected } from "wagmi";
import { robinhoodChain } from "@/lib/chain";

/* Injected wallets only. No WalletConnect project id to leak, no modal
   dependency, and nothing to configure before the thing runs. */
export const wagmiConfig = createConfig({
  chains: [robinhoodChain],
  connectors: [injected()],
  transports: { [robinhoodChain.id]: http() },
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
