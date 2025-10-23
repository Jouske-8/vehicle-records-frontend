"use client";

import { useState, useEffect } from "react";
import { fetchVehicleRequestFull, VehicleRegistration, VehicleStatus } from "@/lib/fetchFullReg";
import ApproveDialog from "@/components/ApproveDialog";

interface RegReqViewProps {
  requestId: string;
}

export default function RegReqView({ requestId }: RegReqViewProps) {
  const [requestDetails, setRequestDetails] = useState<VehicleRegistration | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchVehicleRequestFull(requestId);
      setRequestDetails(data);
      setLoading(false);
    };
    fetchData();
  }, [requestId]);

  const handleApprove = () => {
    // Placeholder: call blockchain write function to approve
    console.log("Approve clicked for request:", requestId);
  };

  const handleDeny = () => {
    // Placeholder: call blockchain write function to deny
    console.log("Deny clicked for request:", requestId);
  };

  if (loading) {
    return <p>Loading request details...</p>;
  }

  if (!requestDetails) {
    return <p>No details found for this request.</p>;
  }

  return (
    <main className="max-w-xl mx-auto p-4 flex flex-col gap-4 bg-white shadow rounded">
      <h1 className="text-2xl font-bold">Vehicle Registration Request</h1>

      <div className="space-y-2">
        <p>
          <strong>Request ID:</strong> {requestId}
        </p>
        <p>
          <strong>Owner Address:</strong> {requestDetails.ownerAddress}
        </p>
        <p>
          <strong>Requester Address:</strong> {requestDetails.requesterAddress}
        </p>
        <p>
          <strong>Issuer Address:</strong> {requestDetails.issuerAddress}
        </p>
        <p>
          <strong>Registration Date:</strong>{" "}
          {new Date(Number(requestDetails.registrationDate) * 1000).toLocaleString()}
        </p>
        <p>
          <strong>Status:</strong> {VehicleStatus[requestDetails.status]}
        </p>
        <p>
          <strong>IPFS Hash:</strong>{" "}
          <a
            href={`https://ipfs.io/ipfs/${requestDetails.regIpfsHash}`}
            target="_blank"
            className="text-blue-600 underline"
          >
            View Documents
          </a>
        </p>
        <p>
          <strong>Minted:</strong> {requestDetails.minted ? "Yes" : "No"}
        </p>
      </div>

      <div className="flex gap-4 mt-4">
        <ApproveDialog requestId={requestId} />
        <button
          onClick={handleDeny}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Deny
        </button>
      </div>
    </main>
  );
}
