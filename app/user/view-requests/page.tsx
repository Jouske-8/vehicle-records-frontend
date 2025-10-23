"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { DataTable } from "./data-table";
import { columns } from "./columns";

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
          const response = await fetch("http://localhost:4000/api/vehicle-events/requested");
          const data = await response.json();
          const requests = data as VehicleRequest[];
          console.log(requests)
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
      {!loading && requests.length > 0 &&
        <DataTable columns={columns} data={requests} />
      }
    </main>
  );
}
