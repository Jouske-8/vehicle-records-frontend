"use client"

import { ColumnDef } from "@tanstack/react-table"
import { VehicleRequest } from "@/lib/registration"
import Link from "next/link"
export const columns: ColumnDef<VehicleRequest>[] = [
  {
    accessorKey: "requestId",
    header: () => <div className="text-right">Request ID</div>,
    cell: ({ row }) => {  
      return (
        <div className="flex gap-4 items-center">
            <p>{row.original.requestId}</p>
          <Link className="bg-blue-300 py-2 px-4 rounded-2xl" href={`/user/view-requests/${row.original.requestId}`}>View</Link>
        </div>
      );
    },
  },
  {
    accessorKey: "requester",
    header: () => <div className="text-right">Requester</div>,
  },
  {
    accessorKey: "owner",
    header: () => <div className="text-right">Owner</div>,
  },
  {
    accessorKey: "regIpfsHash",
    header: () => <div className="text-right">Reg IPFS Hash</div>,
  }
]