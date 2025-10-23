import { getPublicClient } from "@/utils/publicClient";
import { parseAbiItem } from "viem";

const VEHICLE_REGISTRY_ADDRESS = "0xc766710e32112df1Eb266C90F5D8aEd2e58784ea";
const LOOKBACK_BLOCKS = 100_000n;
const BATCH_SIZE = 5000n;

const eventAbi = parseAbiItem(
  "event VehicleRegistrationRequested(uint256 indexed requestId, address indexed requester, address indexed owner, string regIpfsHash)"
);

export interface VehicleRequest {
  requestId: bigint;
  requester: string;
  owner: string;
  regIpfsHash: string;
}

/**
 * Fetch VehicleRegistrationRequested events for a given account
 */
export async function fetchVehicleRequests(): Promise<VehicleRequest[]> {
  const publicClient = getPublicClient();
  const latestBlock = await publicClient.getBlockNumber();
  const fromBlock = latestBlock > LOOKBACK_BLOCKS ? latestBlock - LOOKBACK_BLOCKS : 0n;
  
  const allLogs: any[] = [];
  let startBlock = fromBlock;

  while (startBlock <= latestBlock) {
    const endBlock = startBlock + BATCH_SIZE > latestBlock ? latestBlock : startBlock + BATCH_SIZE;

    const logs = await publicClient.getLogs({
      address: VEHICLE_REGISTRY_ADDRESS,
      event: eventAbi,
      fromBlock: startBlock,
      toBlock: endBlock,
    });

    allLogs.push(...logs);
    startBlock = endBlock + 1n;
  }


  return allLogs.map((log) => ({
    requestId: log.args.requestId,
    requester: log.args.requester,
    owner: log.args.owner,
    regIpfsHash: log.args.regIpfsHash,
  }));
}
