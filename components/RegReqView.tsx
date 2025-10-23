"use client";

import { useState, useEffect } from "react";
import { fetchVehicleRequestFull, VehicleRegistration, VehicleStatus } from "@/lib/fetchFullReg";
import ApproveDialog from "@/components/ApproveDialog";
import { rejectVehicleRegistration } from "@/contract/vehicleRegistryWallet";

interface RegReqViewProps {
  requestId: string;
}

export default function RegReqView({ requestId }: RegReqViewProps) {
  const [requestDetails, setRequestDetails] = useState<VehicleRegistration | null>(null);
  const [loading, setLoading] = useState(true);
  const [denyReason, setDenyReason] = useState("");
  const [denyLoading, setDenyLoading] = useState(false);
  const [denyStatus, setDenyStatus] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchVehicleRequestFull(requestId);
      setRequestDetails(data);
      setLoading(false);
    };
    fetchData();
  }, [requestId]);

  const handleDeny = async () => {
    if (!denyReason.trim()) {
      setDenyStatus({ success: false, message: "Please provide a reason for denial." });
      return;
    }

    try {
      setDenyLoading(true);
      const hash = await rejectVehicleRegistration(requestId, denyReason);
      setDenyStatus({ success: true, message: `Request denied successfully. Tx: ${hash}` });
      setDenyReason("");
    } catch (error) {
      console.error("Error denying vehicle registration:", error);
      setDenyStatus({ success: false, message: "Error denying vehicle registration." });
    } finally {
      setDenyLoading(false);
    }
  };

  if (loading) return <p>Loading request details...</p>;
  if (!requestDetails) return <p>No details found for this request.</p>;

  return (
    <main className="max-w-xl mx-auto p-4 flex flex-col gap-4 bg-white shadow rounded">
      <h1 className="text-2xl font-bold">Vehicle Registration Request</h1>

      <div className="space-y-2">
        <p><strong>Request ID:</strong> {requestId}</p>
        <p><strong>Owner Address:</strong> {requestDetails.ownerAddress}</p>
        <p><strong>Requester Address:</strong> {requestDetails.requesterAddress}</p>
        <p><strong>Issuer Address:</strong> {requestDetails.issuerAddress}</p>
        <p>
          <strong>Registration Date:</strong>{" "}
          {new Date(Number(requestDetails.registrationDate) * 1000).toLocaleString()}
        </p>
        <p><strong>Status:</strong> {VehicleStatus[requestDetails.status]}</p>
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
        <p><strong>Minted:</strong> {requestDetails.minted ? "Yes" : "No"}</p>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <ApproveDialog requestId={requestId} />

        <div className="flex flex-col gap-2">
          <label htmlFor="denyReason" className="font-medium text-sm">
            Denial Reason
          </label>
          <textarea
            id="denyReason"
            value={denyReason}
            onChange={(e) => setDenyReason(e.target.value)}
            placeholder="Enter reason for denial"
            className="border rounded p-2 text-sm resize-none"
            rows={3}
            disabled={denyLoading}
          />
          <button
            onClick={handleDeny}
            disabled={denyLoading}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            {denyLoading ? "Denying..." : "Deny"}
          </button>
          {denyStatus && (
            <p
              className={`text-sm ${
                denyStatus.success ? "text-green-600" : "text-red-600"
              }`}
            >
              {denyStatus.message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
