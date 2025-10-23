// utils/publicClient.ts
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

let publicClient: ReturnType<typeof createPublicClient> | null = null;

export function getPublicClient() {
  if (!publicClient) {
    publicClient = createPublicClient({
      chain: sepolia,
      transport: http(),
    });
  }
  return publicClient;
}
