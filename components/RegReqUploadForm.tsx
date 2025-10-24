"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { uploadFilesToServer } from "@/lib/uploadFile";
import { handleVehicleRegistration } from "@/contract/vehicleRegistryWallet";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function UploadForm() {
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    // Optional: validate all files exist
    const requiredFiles = ["addressProof", "invoice", "chasisEngine", "panCard"];
    for (const fileName of requiredFiles) {
      if (!formData.get(fileName)) {
        alert(`Please upload ${fileName}`);
        return;
      }
    }

    setUploading(true);
    setStatus("Uploading files...");

    try {
      const data = await uploadFilesToServer(formData, "/api/files");
      const ipfsHash = data.ipfsHash;

      setStatus("Sending vehicle registration...");

      await handleVehicleRegistration(ipfsHash);

      setStatus("Vehicle registration sent successfully ✅");
    } catch (err) {
      console.error(err);
      setStatus("Failed: " + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 w-full max-w-md"
      >
        <Label htmlFor="addressProof">Address Proof</Label>
        <Input type="file" id="addressProof" name="addressProof" />
        <Label htmlFor="invoice">Invoice</Label>
        <Input type="file" id="invoice" name="invoice" />
        <Label htmlFor="chasisEngine">Picture</Label>
        <Input type="file" id="chasisEngine" name="chasisEngine" />
        <Label htmlFor="panCard">Picture</Label>
        <Input type="file" id="panCard" name="panCard" />
        <Button type="submit" disabled={uploading} className="bg-blue-600 hover:bg-blue-700">
          {uploading ? "Processing..." : "Upload & Register Vehicle"}
        </Button>
      </form>

      {status && (
        <div className="mt-4 p-2 border rounded-md bg-gray-50 w-full max-w-md">
          <p className="font-medium">{status}</p>
        </div>
      )}
    </>
  );
}