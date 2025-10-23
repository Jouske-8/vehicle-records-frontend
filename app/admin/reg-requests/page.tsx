import { fetchVehicleRequests } from "@/lib/registration";
import Link from "next/link";
export default async function RegRequestsPage() {
  // This runs on the server
  const allRequests = await fetchVehicleRequests();

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Admin Registration Requests</h1>
      <div className="flex flex-col">
        {allRequests.map((req) => (
          <Link key={req.requestId.toString()} href={`/admin/reg-requests/${req.requestId}`}>
            {req.requestId.toString()} - {req.owner} - {req.regIpfsHash}
          </Link>
        ))}
      </div>
    </div>
  );
}
