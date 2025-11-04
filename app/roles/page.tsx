import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function RolesManagementPage() {
  // Fetch all role events in parallel
  const [requestedRes, approvedRes, deniedRes] = await Promise.all([
    fetch("http://localhost:4000/api/role-events/requested", {
      cache: "no-store",
    }),
    fetch("http://localhost:4000/api/role-events/approved", {
      cache: "no-store",
    }),
    fetch("http://localhost:4000/api/role-events/denied", {
      cache: "no-store",
    }),
  ]);

  const [requested, approved, denied] = await Promise.all([
    requestedRes.json(),
    approvedRes.json(),
    deniedRes.json(),
  ]);

  // Build sets of already-processed request IDs
  const processedIds = new Set([
    ...approved.map((r: any) => r.requestId),
    ...denied.map((r: any) => r.requestId),
  ]);

  // Filter out any requests that have already been approved or denied
  const pendingRequests = requested.filter(
    (req: any) => !processedIds.has(req.requestId)
  );

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
            Role Requests
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-gray-300">
            Review and process pending role grant requests.
          </p>
        </div>

        {/* --- Glassmorphism Container for the table --- */}
        <div
          className="w-full flex flex-col gap-4 p-4 sm:p-6 
                     rounded-2xl 
                     border border-gray-500/30 
                     bg-white/10 
                     backdrop-blur-lg 
                     shadow-xl"
        >
          {pendingRequests.length === 0 ? (
            <p className="text-center text-lg text-gray-300 p-8">
              No pending role requests found.
            </p>
          ) : (
            <DataTable columns={columns} data={pendingRequests} />
          )}
        </div>
      </main>
    </div>
  );
}