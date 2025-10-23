"use client";

import { useEffect, useState } from "react";
import { fetchVehicleRequests } from "@/lib/vehicleReg";
import { useAccount } from "wagmi";

interface VehicleRequest {
  requestId: bigint;
  requester: string;
  owner: string;
  regIpfsHash: string;
}

export default function MyVehicleRequests() {
  const [requests, setRequests] = useState<VehicleRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      try {
        if (address) {
          const requests = await fetchVehicleRequests();
          const myRequests = requests.filter((req) => req.owner.toLowerCase() === address.toLowerCase());
          setRequests(myRequests);
        }
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, [address]);

  return (
    <main className="w-full min-h-screen flex flex-col justify-center items-center gap-4 p-4">
      <h1 className="text-xl font-semibold">
        Vehicle Requests (Last 100,000 Blocks)
      </h1>

      {loading && <p>Loading...</p>}
      {!loading && requests.length === 0 && (
        <p>No requests found in the last 100,000 blocks.</p>
      )}

      <ul className="flex flex-col gap-4 w-full max-w-md">
        {requests.map((req) => (
          <li
            key={req.requestId.toString()}
            className="border p-2 rounded-md bg-gray-50"
          >
            <p>
              <strong>Request ID:</strong> {req.requestId.toString()}
            </p>
            <p>
              <strong>Requester:</strong> {req.requester}
            </p>
            <p>
              <strong>Owner:</strong> {req.owner}
            </p>
            <p>
              <strong>IPFS Hash:</strong> {req.regIpfsHash}
            </p>
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
