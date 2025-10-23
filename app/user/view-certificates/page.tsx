import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function Page() {
const response =  await fetch("http://localhost:4000/api/vehicle-events/approved");
  const certificates = await response.json();
  const totalPages = certificates.length > 0 ? Math.ceil(certificates.length / 1) : 1; // assuming 1 per page
  console.log("Total Pages:", totalPages);
  return (
    <div>
      {/* <CertificateView certificates={certificates} pageSize={1} /> */}
      <DataTable columns={columns} data={certificates} />
      {/* <PaginationTable
        rootUrl="/user/view-certificates"
        totalPages={totalPages}
        pageSize={1}
      /> */}
    </div>
  );
}
