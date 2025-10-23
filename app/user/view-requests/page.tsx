"use client";

import { useEffect, useState } from "react";
import { publicClient, account } from "@/utils/viemClient";
import { parseAbiItem } from "viem";
import VehicleRegistryJson from "@/abi/VehicleRegistry.json";

const VEHICLE_REGISTRY_ADDRESS = "0xc766710e32112df1Eb266C90F5D8aEd2e58784ea";
const LOOKBACK_BLOCKS = 100_000n;
const BATCH_SIZE = 5000n; // batch size to avoid RPC limits

interface VehicleRequest {
  requestId: bigint;
  requester: string;
  owner: string;
  regIpfsHash: string;
}

export default function MyVehicleRequests() {
  const [requests, setRequests] = useState<VehicleRequest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const latestBlock = await publicClient.getBlockNumber();
        const fromBlock = latestBlock > LOOKBACK_BLOCKS ? latestBlock - LOOKBACK_BLOCKS : 0n;

        const eventAbi = parseAbiItem(
          "event VehicleRegistrationRequested(uint256 indexed requestId, address indexed requester, address indexed owner, string regIpfsHash)"
        );

        let allLogs: any[] = [];
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

        // Filter only logs where owner matches current account
        const myLogs = allLogs.filter((log) => log.args.owner.toLowerCase() === account?.toLowerCase());

        const parsedRequests: VehicleRequest[] = myLogs.map((log) => ({
          requestId: log.args.requestId,
          requester: log.args.requester,
          owner: log.args.owner,
          regIpfsHash: log.args.regIpfsHash,
        }));

        setRequests(parsedRequests);
      } catch (err) {
        console.error("Error fetching vehicle requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <main className="w-full min-h-screen flex flex-col justify-center items-center gap-4 p-4">
      <h1 className="text-xl font-semibold">Vehicle Requests (Last 100,000 Blocks)</h1>

      {loading && <p>Loading...</p>}
      {!loading && requests.length === 0 && <p>No requests found in the last 100,000 blocks.</p>}

      <ul className="flex flex-col gap-4 w-full max-w-md">
        {requests.map((req) => (
          <li key={req.requestId.toString()} className="border p-2 rounded-md bg-gray-50">
            <p><strong>Request ID:</strong> {req.requestId.toString()}</p>
            <p><strong>Requester:</strong> {req.requester}</p>
            <p><strong>Owner:</strong> {req.owner}</p>
            <p><strong>IPFS Hash:</strong> {req.regIpfsHash}</p>
            <a
              href={`https://ipfs.io/ipfs/${req.regIpfsHash}`}
              target="_blank"
              className="text-blue-600 underline"
            >
              View Documents
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
