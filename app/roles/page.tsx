import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function RolesManagementPage() {
  // Fetch all role events in parallel
  const [requestedRes, approvedRes, deniedRes] = await Promise.all([
    fetch("http://localhost:4000/api/role-events/requested", { cache: "no-store" }),
    fetch("http://localhost:4000/api/role-events/approved", { cache: "no-store" }),
    fetch("http://localhost:4000/api/role-events/denied", { cache: "no-store" }),
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
    <main className="min-h-screen flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Roles Management</h1>
      <DataTable columns={columns} data={pendingRequests} />
    </main>
  );
}
