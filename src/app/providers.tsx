"use client";

import {
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { WagmiProvider, createConfig } from "wagmi";
import { anvil, sepolia } from "wagmi/chains";
import { http } from "viem";
import "@rainbow-me/rainbowkit/styles.css";

if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
  throw new Error(
    "Missing NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID environment variable"
  );
}

const { wallets } = getDefaultWallets({
  appName: "Coffee Mate",
  projectId:
    process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
});

const config = createConfig({
  chains: [anvil, sepolia],
  transports: {
    [anvil.id]: http("http://127.0.0.1:8545"),
    [sepolia.id]: http("https://sepolia.infura.io/v3/"),
  },
});

const queryClient = new QueryClient();

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
