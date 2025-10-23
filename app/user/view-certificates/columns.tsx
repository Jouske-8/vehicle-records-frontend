"use client"

import { ColumnDef } from "@tanstack/react-table"
import { VehicleCertificate } from "@/contract/vehicleRegistryServer"

export const columns: ColumnDef<VehicleCertificate>[] = [
  {
    accessorKey: "requestId",
    header: () => <div className="text-right">Request ID</div>,
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