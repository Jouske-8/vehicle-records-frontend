"use client";

import { useState, useEffect } from "react";
import { fetchVehicleRequestFull } from "@/lib/fetchFullReg";
import { VehicleRegistration } from "@/lib/fetchFullReg";
import ItemWithDialog from "./ItemWithDialog";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { VehicleStatus } from "@/lib/fetchFullReg";

interface ImageProps {
  addressProof: string;
  invoice: string;
  chasisEngine: string;
  panCard: string;
  timestamp: string;
}

export default function VehicleRequest({ requestId }: { requestId: string }) {
  const [vehicleRequest, setVehicleRequest] =
    useState<VehicleRegistration | null>(null);
  const [images, setImages] = useState<ImageProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const request = await fetchVehicleRequestFull(requestId);
        setVehicleRequest(request);
        if (!request) {
          setLoading(false);
          return;
        }
        // Fetch the single IPFS file which contains multiple Base64 images
        const res = await fetch(`https://ipfs.io/ipfs/${request.regIpfsHash}`);
        const data: ImageProps = await res.json(); // assuming the file is a JSON array of Base64 strings
        setImages(data);
      } catch (err) {
        console.error("Failed to fetch vehicle request or images:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [requestId]);
  console.log(images);
  if (loading) return <div>Loading...</div>;
  if (!vehicleRequest) return <div>Vehicle Request Not Found</div>;
  console.log(vehicleRequest);
  const date = Number(vehicleRequest.registrationDate) * 1000;
  const dateObj = new Date(date);
  return (
    <div className="flex w-full max-w-md flex-col gap-6 p-6">
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Details</ItemTitle>
          <ItemDescription>
            Owner Address: {vehicleRequest.ownerAddress}
          </ItemDescription>
          <ItemDescription>
            Requester Address: {vehicleRequest.requesterAddress}
          </ItemDescription>
          <ItemDescription>
            Status: {VehicleStatus[vehicleRequest.status] ?? "Pending"}
          </ItemDescription>
        </ItemContent>
      </Item>
      <ItemWithDialog
        title="Address Proof"
        description="Click the button to view address proof."
        imageSrc={images?.addressProof}
      />
      <ItemWithDialog
        title="Chasis & Engine Proof"
        description="Click the button to view chasis & engine proof."
        imageSrc={images?.chasisEngine}
      />
      <ItemWithDialog
        title="PAN Card"
        description="Click the button to view PAN card."
        imageSrc={images?.panCard}
      />
      <ItemWithDialog
        title="Invoice"
        description="Click the button to view invoice."
        imageSrc={images?.invoice}
      />
    </div>
  );
}
