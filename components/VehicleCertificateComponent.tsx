"use client";

import { fetchVehicleCertificate } from "@/contract/vehicleRegistryWallet";
import { useState, useEffect } from "react";
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

interface ImageProps {
  certificate: string;
  timestamp: string;
}

interface VehicleCertificate {
  ownerAddress: string;
  registrationDate: string,
  issuerAddress: string;
  certIpfsHash: string;
}

export default function VehicleCertificateComponent({
  tokenId,
}: {
  tokenId: string;
}) {
  const [vehicleCertificate, setVehicleCertificate] =
    useState<VehicleCertificate | null>(null);
  const [images, setImages] = useState<ImageProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const request = await fetchVehicleCertificate(tokenId);
        setVehicleCertificate(request);
        if (!request) {
          setLoading(false);
          return;
        }
        // Fetch the single IPFS file which contains multiple Base64 images
        const res = await fetch(
          `https://ipfs.io/ipfs/${request?.certIpfsHash}`
        );
        const data: ImageProps = await res.json(); // assuming the file is a JSON array of Base64 strings
        setImages(data);
      } catch (err) {
        console.error("Failed to fetch vehicle request or images:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [tokenId]);
  if (loading) return <div>Loading...</div>;
  if (!vehicleCertificate) return <div>Vehicle Certificate Not Found</div>;
  const date = Number(vehicleCertificate.registrationDate) * 1000;
  const dateObj = new Date(date);
  return (
    <div className="flex w-full max-w-md flex-col gap-6 p-6">
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Details</ItemTitle>
          <ItemDescription>Owner Address: {vehicleCertificate.ownerAddress}</ItemDescription>
          <ItemDescription>Issuer Address: {vehicleCertificate.issuerAddress}</ItemDescription>
          <ItemDescription>Registration Date: {dateObj.toLocaleDateString()}</ItemDescription>
        </ItemContent>
      </Item>
      <ItemWithDialog
        title="Vehicle Certificate"
        description="Click the button to view vehicle certificate."
        imageSrc={images?.certificate}
      />
    </div>
  );
}
