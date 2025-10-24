"use client";
import { useRoles } from "@/hooks/RolesContext";

export default function DisplayRoles() {
  const roles = useRoles();

  return (
    <>
      {roles?.loading ? (
        <span className="text-black">Loading roles...</span>
      ) : (
        <div className="flex items-center gap-4">
          {roles?.isAdmin && (
            <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-medium">
              Admin
            </span>
          )}
          {roles?.isAuditor && (
            <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
              Auditor
            </span>
          )}
          {roles?.isDealer && (
            <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-medium">
              Dealer
            </span>
          )}
          {roles?.isOwner && (
            <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm font-medium">
              Owner
            </span>
          )}
        </div>
      )}
    </>
  );
}
