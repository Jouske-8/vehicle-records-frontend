"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { approveRoleRequest, denyRoleRequest } from "@/contract/vehicleRegistryWallet";

export interface RoleRequest {
  requestId: string;
  requester: string;
  role: string;
  blockNumber: number;
  txHash: string;
}

export const columns: ColumnDef<RoleRequest>[] = [
  {
    accessorKey: "requestId",
    header: "Request ID",
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.original.requestId}</div>
    ),
  },
  {
    accessorKey: "requester",
    header: "Requester",
    cell: ({ row }) => (
      <div className="truncate max-w-[200px] text-sm text-muted-foreground">
        {row.original.requester}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Requested Role",
    cell: ({ row }) => <div>{row.original.role}</div>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const { requestId } = row.original;

      const handleApprove = async () => {
        try {
          toast.loading("Approving role...");
          await approveRoleRequest(requestId);
          toast.success("✅ Role approved successfully!");
        } catch (err) {
          console.error(err);
          toast.error("❌ Failed to approve role");
        } finally {
          toast.dismiss();
        }
      };

      const handleDeny = async () => {
        try {
          toast.loading("Denying role...");
          await denyRoleRequest(requestId);
          toast.success("🚫 Role denied successfully!");
        } catch (err) {
          console.error(err);
          toast.error("❌ Failed to deny role");
        } finally {
          toast.dismiss();
        }
      };

      return (
        <div className="flex gap-3 justify-end">
          <Button
            onClick={handleApprove}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Approve
          </Button>
          <Button
            onClick={handleDeny}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Deny
          </Button>
        </div>
      );
    },
  },
];
