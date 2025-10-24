// utils/publicClient.ts
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

let publicClient: ReturnType<typeof createPublicClient> | null = null;

export function getPublicClient() {
  if (!publicClient) {
    publicClient = createPublicClient({
      chain: sepolia,
      transport: http("https://eth-sepolia.g.alchemy.com/v2/efP9j-rmB2BIlDFRhXPg9"),
    });
  }
  return publicClient;
}
