import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function Page() {
  let certificates = []; // Default to empty array
  
  try {
    // Fetch data from the server
    const response = await fetch("http://localhost:4000/api/vehicle-events/approved");
    if (response.ok) {
      certificates = await response.json();
    } else {
      console.error("Failed to fetch approved vehicles:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching approved vehicles:", error);
    // certificates will remain an empty array
  }

  return (
    // Set the dark gradient background for the entire page
    <main className="w-full min-h-screen flex flex-col items-center gap-6 p-4 pt-24 sm:p-8 sm:pt-24 bg-gradient-to-br from-gray-900 to-black text-gray-100">
      
      {/* Title using the blue-cyan-green gradient theme */}
      <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-cyan-300 to-green-300">
        Approved Vehicle Registrations
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
        {/* Handle empty state */}
        {certificates.length === 0 ? (
          <p className="text-center text-lg text-gray-300 p-8">
            No approved vehicle registrations found.
          </p>
        ) : (
          <DataTable columns={columns} data={certificates} />
        )}
      </div>
    </main>
  );
}