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

    // ... (Your validation logic) ...

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

  // Helper function to get status text color
  const getStatusColor = () => {
    if (status.startsWith("Failed")) return "text-red-400";
    if (status.includes("successfully")) return "text-green-400";
    return "text-gray-300"; // Default/in-progress color
  };

  return (
    // Main Glassmorphism Container
    <div
      className="w-full max-w-md flex flex-col gap-4 p-6 sm:p-8 
                 rounded-2xl 
                 border border-gray-500/30 
                 bg-white/10 
                 backdrop-blur-lg 
                 shadow-xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        {/* Styled Label/Input pairs for dark theme */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="addressProof" className="text-gray-200 font-medium">
            Address Proof
          </Label>
          <Input type="file" id="addressProof" name="addressProof" />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="invoice" className="text-gray-200 font-medium">
            Invoice
          </Label>
          <Input type="file" id="invoice" name="invoice" />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="chasisEngine" className="text-gray-200 font-medium">
            Chasis/Engine Number
          </Label>
          <Input type="file" id="chasisEngine" name="chasisEngine" />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="panCard" className="text-gray-200 font-medium">
            Pan Card
          </Label>
          <Input type="file" id="panCard" name="panCard" />
        </div>

        <Button
          type="submit"
          disabled={uploading}
          // --- Button class updated with the new theme ---
          className="mt-4 w-full font-semibold text-gray-900 bg-gradient-to-r from-blue-300 via-cyan-300 to-green-300 hover:from-blue-400 hover:via-cyan-400 hover:to-green-400 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          {uploading ? "Processing..." : "Upload & Register Vehicle"}
        </Button>
      </form>

      {status && (
        // Styled status message box
        <div className="mt-2 p-3 border border-gray-500/30 rounded-md bg-gray-900/50 w-full">
          <p className={`font-medium text-center ${getStatusColor()}`}>
            {status}
          </p>
        </div>
      )}
    </div>
  );
}