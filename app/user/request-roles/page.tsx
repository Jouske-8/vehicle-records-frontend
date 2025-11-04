"use client";

import RoleRequestForm from "@/components/RequestRoleForm";
import { requestRole } from "@/contract/vehicleRegistryWallet";

export default function RolePage() {
  const handleRoleSubmit = async ({ role }: { role: string }) => {
    try {
      await requestRole(role);
      alert("Role request submitted successfully.");
    } catch (error) {
      console.error("Error submitting role request:", error);
      alert("Failed to submit role request.");
    }
  };

  return (
    // Set the dark gradient background for the entire page
    <main className="w-full min-h-screen flex flex-col justify-center items-center gap-6 p-4 bg-gradient-to-br from-gray-900 to-black text-gray-100">
      
      {/* Styled the title with the blue-cyan-green gradient */}
      <h1 className="text-3xl font-semibold 
           bg-clip-text text-transparent 
           bg-gradient-to-r from-blue-300 via-cyan-300 to-green-300">
        Request New Role
      </h1>

      {/* This RoleRequestForm will be the "glass" element.
          It will need its own styles (backdrop-blur, bg-white/10, border) 
          to "pop" against this dark background.
      */}
      <RoleRequestForm onSubmit={handleRoleSubmit} />
    </main>
  );
}