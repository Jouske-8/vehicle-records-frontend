import { getPublicClient } from "@/utils/publicClient";
import { parseAbiItem } from "viem";

const LOOKBACK_BLOCKS = 50000n; // same as before
const BATCH_SIZE = 2000n;

const contractAddress = "0xc766710e32112df1Eb266C90F5D8aEd2e58784ea"

export const vehicleApprovedEvent = parseAbiItem(
  "event VehicleRegistrationApproved(uint256 indexed requestId, uint256 indexed tokenId, address indexed owner, string certIpfsHash)"
);


export interface VehicleCertificate {
  requestId: bigint;
  tokenId: bigint;
  owner: string;
  certIpfsHash: string;
}

/**
 * Fetch all VehicleRegistrationApproved events from the registry
 */
export async function fetchVehicleCertificates(): Promise<VehicleCertificate[]> {
  const publicClient = getPublicClient();
  const latestBlock = await publicClient.getBlockNumber();
  const fromBlock = latestBlock > LOOKBACK_BLOCKS ? latestBlock - LOOKBACK_BLOCKS : 0n;

  const allLogs: any[] = [];
  let startBlock = fromBlock;

  while (startBlock <= latestBlock) {
    const endBlock = startBlock + BATCH_SIZE > latestBlock ? latestBlock : startBlock + BATCH_SIZE;

    const logs = await publicClient.getLogs({
      address: contractAddress,
      event: vehicleApprovedEvent,
      fromBlock: startBlock,
      toBlock: endBlock,
    });

    allLogs.push(...logs);
    startBlock = endBlock + 1n;
  }

  return allLogs.map((log) => ({
    requestId: log.args.requestId,
    tokenId: log.args.tokenId,
    owner: log.args.owner,
    certIpfsHash: log.args.certIpfsHash,
  }));
}
