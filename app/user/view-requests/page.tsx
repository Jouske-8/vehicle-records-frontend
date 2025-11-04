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
          const response = await fetch(
            "http://localhost:4000/api/vehicle-events/requested"
          );
          const data = await response.json();
          const requests = data as VehicleRequest[];
          console.log(requests);
          const myRequests = requests.filter(
            (req) => req.owner.toLowerCase() === address.toLowerCase()
          );
          setRequests(myRequests);
        }
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, [address]);

  return (
    // Set the dark gradient background for the entire page
    // Using `pt-24` for top padding to position content below a potential navbar
    <main className="w-full min-h-screen flex flex-col items-center gap-6 p-4 pt-24 sm:p-8 sm:pt-24 bg-gradient-to-br from-gray-900 to-black text-gray-100">
      
      {/* Title using the blue-cyan-green gradient theme */}
      <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-cyan-300 to-green-300">
        My Vehicle Requests
      </h1>

      {/* Glassmorphism Container for the table */}
      <div
        className="w-full max-w-6xl flex flex-col gap-4 p-4 sm:p-6 
                   rounded-2xl 
                   border border-gray-500/30 
                   bg-white/10 
                   backdrop-blur-lg 
                   shadow-xl"
      >
        {loading && (
          <p className="text-center text-lg text-gray-300 p-8">Loading...</p>
        )}

        {!loading && requests.length === 0 && (
          <p className="text-center text-lg text-gray-300 p-8">
            No requests found in the last 100,000 blocks.
          </p>
        )}

        {/* The DataTable will live inside the glass panel */}
        {!loading && requests.length > 0 && (
          <DataTable columns={columns} data={requests} />
        )}
      </div>
    </main>
  );
}