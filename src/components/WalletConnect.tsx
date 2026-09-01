"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { CHAIN_ID } from "@/lib/chain";
import { shortAddress } from "@/lib/format";
import { Button } from "./ui/Button";

/* wagmi's connection state differs between the server render and the first
   client render, so anything that depends on it has to wait a tick or React
   reports a hydration mismatch. */
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export function WalletConnect({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  const mounted = useMounted();
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: switching } = useSwitchChain();

  const injected = connectors.find((c) => c.id === "injected") ?? connectors[0];
  const hasWallet = mounted && typeof window !== "undefined" && "ethereum" in window;

  /* Render the server's shape until mounted so the markup matches. */
  if (!mounted) {
    return (
      <Button variant="accent" size={size} disabled>
        Connect
      </Button>
    );
  }

  if (!hasWallet) {
    return (
      <a
        href="https://ethereum.org/en/wallets/find-wallet/"
        target="_blank"
        rel="noreferrer noopener"
      >
        <Button variant="outline" size={size} type="button">
          Get a wallet
        </Button>
      </a>
    );
  }

  if (isConnected && chainId !== CHAIN_ID) {
    return (
      <Button
        variant="accent"
        size={size}
        onClick={() => switchChain({ chainId: CHAIN_ID })}
        disabled={switching}
      >
        {switching ? "Switching…" : "Wrong network"}
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <Button variant="outline" size={size} onClick={() => disconnect()} title="Disconnect">
        {shortAddress(address)}
      </Button>
    );
  }

  return (
    <Button
      variant="accent"
      size={size}
      onClick={() => injected && connect({ connector: injected })}
      disabled={isPending || !injected}
    >
      {isPending ? "Check wallet…" : "Connect"}
    </Button>
  );
}
