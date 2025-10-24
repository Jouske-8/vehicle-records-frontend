"use client"

import { ColumnDef } from "@tanstack/react-table"
import { VehicleCertificate } from "@/lib/certificate"
import Link from "next/link"

export const columns: ColumnDef<VehicleCertificate>[] = [
  {
    accessorKey: "requestId",
    header: () => <div className="text-right">Request ID</div>,
        cell: ({ row }) => {  
      return (
        <div className="flex gap-4 items-center">
          <p>{row.original.requestId}</p>
          <Link className="bg-blue-300 py-2 px-4 rounded-2xl" href={`/user/view-certificates/${row.original.tokenId}`}>View</Link>
        </div>
      );
    },
  },
  {
    accessorKey: "tokenId",
    header: () => <div className="text-right">Token ID</div>,
  },
  {
    accessorKey: "owner",
    header: () => <div className="text-right">Owner</div>,
  },
  {
    accessorKey: "certIpfsHash",
    header: () => <div className="text-right">IPFS Hash</div>,
  }
]