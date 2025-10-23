import { createPublicClient, createWalletClient, custom, http } from "viem";
import { sepolia } from "viem/chains";

// ---------- Public client (read-only) ----------
export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

// ---------- Wallet client (write, MetaMask) ----------
export const walletClient = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum), // injected provider
});

export const [account] = await walletClient.getAddresses()