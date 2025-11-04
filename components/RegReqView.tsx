"use client";

import { useState, useEffect } from "react";
import {
  fetchVehicleRequestFull,
  VehicleRegistration,
  VehicleStatus,
} from "@/lib/fetchFullReg";
import ApproveDialog from "@/components/ApproveDialog";
import { rejectVehicleRegistration } from "@/contract/vehicleRegistryWallet";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation"; // Import useParams

// Helper function to get a themed badge for the status
const getStatusBadge = (status: VehicleStatus) => {
  const statusName = VehicleStatus[status];
  let colors = "bg-gray-700 text-gray-300"; // Default
  if (statusName === "Approved") {
    colors = "bg-green-800 text-green-200";
  } else if (statusName === "Denied") {
    colors = "bg-red-800 text-red-200";
  } else if (statusName === "Pending") {
    colors = "bg-yellow-800 text-yellow-200";
  }
  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${colors}`}>
      {statusName}
    </span>
  );
};

// This is now the main page component
export default function ViewRequestPage() {
  // Get the requestId from the URL
  const params = useParams();
  const requestId = params.requestId as string;

  const [requestDetails, setRequestDetails] =
    useState<VehicleRegistration | null>(null);
  const [loading, setLoading] = useState(true);
  const [denyReason, setDenyReason] = useState("");
  const [denyLoading, setDenyLoading] = useState(false);
  const [denyStatus, setDenyStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    // Make sure we have a requestId before fetching
    if (requestId) {
      const fetchData = async () => {
        setLoading(true);
        const data = await fetchVehicleRequestFull(requestId);
        setRequestDetails(data);
        setLoading(false);
      };
      fetchData();
    }
  }, [requestId]); // Dependency array includes requestId

  const handleDeny = async () => {
    if (!denyReason.trim()) {
      setDenyStatus({
        success: false,
        message: "Please provide a reason for denial.",
      });
      return;
    }

    try {
      setDenyLoading(true);
      setDenyStatus(null); // Clear previous status
      const hash = await rejectVehicleRegistration(requestId, denyReason);
      setDenyStatus({
        success: true,
        message: `Request denied successfully. Tx: ${hash.slice(0, 10)}...`,
      });
      setDenyReason("");
      // Re-fetch data to update status
      const data = await fetchVehicleRequestFull(requestId);
      setRequestDetails(data);
    } catch (error) {
      console.error("Error denying vehicle registration:", error);
      setDenyStatus({
        success: false,
        message: "Error denying vehicle registration.",
      });
    } finally {
      setDenyLoading(false);
    }
  };

  // Main return combines the page layout and the component logic
  return (
    // This div provides the dark theme, dot-grid, and glow effects
    <div className="fixed inset-0 flex items-center justify-center bg-gray-950 font-sans text-white p-8">
      
      {/* Background dot grid (dimmed) */}
      <div className="absolute inset-0 -z-20 h-full w-full bg-transparent bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-blue-800/20 opacity-50 blur-[120px]" />

      {/* Page Content Area - This centers the component */}
      <main className="z-10 w-full max-w-7xl flex flex-col items-center mt-16">
        
        {/* --- All the component logic is now rendered here --- */}

        {/* Themed Loading State */}
        {loading && (
          <div
            className="w-full max-w-4xl flex flex-col items-center justify-center gap-4 p-8 min-h-[300px]
                       rounded-2xl border border-gray-500/30 bg-white/10 backdrop-blur-lg shadow-xl"
          >
            <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
            <p className="text-lg text-gray-300">Loading request details...</p>
          </div>
        )}

        {/* Themed Not Found State */}
        {!loading && !requestDetails && (
          <div
            className="w-full max-w-4xl flex flex-col items-center justify-center gap-4 p-8 min-h-[300px]
                       rounded-2xl border border-gray-500/30 bg-white/10 backdrop-blur-lg shadow-xl"
          >
            <p className="text-lg text-gray-300">
              No details found for this request.
            </p>
          </div>
        )}

        {/* Main Glass Panel for Details */}
        {!loading && requestDetails && (
          <div
            className="w-full max-w-4xl flex flex-col gap-6 p-6 sm:p-8 
                       rounded-2xl border border-gray-500/30 bg-white/10 
                       backdrop-blur-lg shadow-xl text-gray-200"
          >
            <h1 className="text-2xl font-semibold text-gray-100">
              Vehicle Registration Request
            </h1>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Request ID</span>
                <span className="text-gray-100 font-mono">{requestId}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Status</span>
                {getStatusBadge(requestDetails.status)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Owner Address</span>
                <span className="text-gray-100 font-mono truncate">
                  {requestDetails.ownerAddress}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Requester Address</span>
                <span className="text-gray-100 font-mono truncate">
                  {requestDetails.requesterAddress}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Issuer Address</span>
                <span className="text-gray-100 font-mono truncate">
                  {requestDetails.issuerAddress || "N/A"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Registration Date</span>
                <span className="text-gray-100">
                  {new Date(
                    Number(requestDetails.registrationDate) * 1000
                  ).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Minted</span>
                <span className="text-gray-100">
                  {requestDetails.minted ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Documents</span>
                <a
                  href={`https://ipfs.io/ipfs/${requestDetails.regIpfsHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:text-blue-200 hover:underline"
                >
                  View on IPFS →
                </a>
              </div>
            </div>

            {/* Actions Section */}
            {requestDetails.status === VehicleStatus.Pending && (
              <div className="flex flex-col md:flex-row gap-6 mt-4 pt-6 border-t border-gray-500/30">
                {/* Approve Action */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-100 mb-4">
                    Approve Request
                  </h3>
                  <ApproveDialog requestId={requestId} />
                  <p className="text-xs text-gray-400 mt-2">
                    This will mint the NFT and assign it to the owner.
                  </p>
                </div>

                {/* Deny Action */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-100 mb-4">
                    Deny Request
                  </h3>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="denyReason"
                      className="font-medium text-sm text-gray-200"
                    >
                      Denial Reason
                    </label>
                    <textarea
                      id="denyReason"
                      value={denyReason}
                      onChange={(e) => setDenyReason(e.target.value)}
                      placeholder="Enter reason for denial"
                      className="w-full bg-gray-700/50 border border-gray-500/50 text-gray-100 
                                 rounded-lg p-3 resize-none 
                                 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={3}
                      disabled={denyLoading}
                    />
                    <button
                      onClick={handleDeny}
                      disabled={denyLoading}
                      className="w-full px-4 py-2 font-semibold bg-red-600 text-white rounded-lg 
                                 hover:bg-red-700 transition-colors
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {denyLoading ? (
                        <span className="flex items-center justify-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Denying...
                        </span>
                      ) : (
                        "Deny Request"
                      )}
                    </button>
                    {denyStatus && (
                      <p
                        className={`text-sm mt-2 text-center ${
                          denyStatus.success ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {denyStatus.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}