import { fetchVehicleRequests } from "@/lib/registration";
import Link from "next/link";
import { FileSearch } from 'lucide-react'; // Icon for requests

export default async function RegRequestsPage() {
  // This runs on the server
  const allRequests = await fetchVehicleRequests();

  return (
    // Main container with dark, "web3" style background
    <div className="relative flex w-full flex-col items-center overflow-hidden bg-gray-950 font-sans text-white p-8 pt-20 min-h-screen">
      
      {/* Background dot grid (dimmed) */}
      <div className="absolute inset-0 -z-20 h-full w-full bg-transparent bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-blue-800/20 opacity-50 blur-[120px]" />
      
      {/* Page Content Area */}
      <main className="z-10 w-full max-w-7xl flex-col items-center">
        
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-transparent sm:text-5xl bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-300 to-green-300">
            Registration Requests
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-gray-300">
            Review and process pending vehicle registration submissions.
          </p>
        </div>

        {/* --- Glassmorphism Container for the list --- */}
        <div
          className="w-full flex flex-col gap-4 p-4 sm:p-6 
                     rounded-2xl 
                     border border-gray-500/30 
                     bg-white/10 
                     backdrop-blur-lg 
                     shadow-xl"
        >
          {allRequests.length === 0 ? (
            <p className="text-center text-lg text-gray-300 p-8">
              No pending registration requests found.
            </p>
          ) : (
            // List of request links
            <div className="flex flex-col gap-3">
              {allRequests.map((req) => (
                <Link
                  key={req.requestId.toString()}
                  href={`/admin/reg-requests/${req.requestId}`}
                  className="
                    flex flex-wrap items-center justify-between gap-x-4 gap-y-2 p-4 rounded-lg 
                    border border-gray-500/30 bg-gray-800/40 
                    text-gray-200 transition-all duration-200 
                    hover:bg-gray-700/60 hover:border-blue-400/50
                  "
                >
                  <div className="flex items-center gap-3">
                    <FileSearch className="h-5 w-5 text-blue-300" />
                    <span className="font-semibold">Request ID: {req.requestId.toString()}</span>
                  </div>
                  <code className="text-sm text-cyan-300 bg-gray-900/50 p-1 px-2 rounded-md truncate max-w-xs">
                    Owner: {req.owner}
                  </code>
                  <span className="text-xs text-gray-400 truncate max-w-xs">
                    IPFS: {req.regIpfsHash}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}