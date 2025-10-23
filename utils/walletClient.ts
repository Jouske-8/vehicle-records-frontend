import { createWalletClient, custom } from "viem";
import { sepolia } from "viem/chains";

let walletClient: ReturnType<typeof createWalletClient> | null = null;
let account: string | null = null;

export async function getWalletClient() {
  if (typeof window === "undefined") {
    throw new Error("WalletClient can only be used on the client");
  }

  // Initialize only once
  if (!walletClient) {
    walletClient = createWalletClient({
      chain: sepolia,
      transport: custom(window.ethereum),
    });
    const addresses = await walletClient.getAddresses();
    account = addresses[0] || null;
  }

  return { walletClient, account };
}
