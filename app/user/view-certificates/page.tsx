import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function Page() {
const response =  await fetch("http://localhost:4000/api/vehicle-events/approved");
  const certificates = await response.json();
  const totalPages = certificates.length > 0 ? Math.ceil(certificates.length / 1) : 1; // assuming 1 per page
  console.log("Total Pages:", totalPages);
  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-4 p-4">
      <DataTable columns={columns} data={certificates} />
    </div>
  );
}
