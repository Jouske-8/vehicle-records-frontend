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
        <main className="min-h-screen flex flex-col gap-4 p-4">
          <RoleRequestForm onSubmit={handleRoleSubmit} />
        </main>
  );
}
