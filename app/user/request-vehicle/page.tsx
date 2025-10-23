"use client";

import { useState } from "react";
import { walletClient, publicClient } from "@/utils/viemClient";
import { Button } from "@/components/ui/button";
import VehicleRegistryJson from '@/abi/VehicleRegistry.json'
import { account } from "@/utils/viemClient";

export default function RequestVehiclePage() {
  const [addressProof, setAddressProof] = useState<File>();
  const [invoice, setInvoice] = useState<File>();
  const [chasisEngine, setChasisEngine] = useState<File>();
  const [panCard, setPanCard] = useState<File>();
  const [uploading, setUploading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState("");
  const [url, setUrl] = useState("");

  const handleVehicleRegistration = (ipfsHash: string) => async () => {
    try {
        const { request } = await publicClient.simulateContract({
            account: account,
            address: '0xc766710e32112df1Eb266C90F5D8aEd2e58784ea',
            abi: VehicleRegistryJson.abi,
            functionName: 'requestVehicleRegistration',
            args: [ipfsHash, account],
        });
        const hash = await walletClient.writeContract(request);
        console.log('Transaction hash:', hash);
    } catch (error) {
        console.error("Error registering vehicle:", error);
    }
  }

  const handleFileChange =
    (setter: (file: File) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) setter(file);
    };

  const uploadFiles = async () => {
    if (!addressProof || !invoice || !chasisEngine || !panCard) {
      alert("Please upload all files");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("addressProof", addressProof);
      formData.append("invoice", invoice);
      formData.append("chasisEngine", chasisEngine);
      formData.append("panCard", panCard);

      const response = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setIpfsHash(data.ipfsHash);
      setUrl(data.url);
      setUploading(false);
    } catch (err) {
      console.error(err);
      setUploading(false);
      alert("Upload failed");
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col justify-center items-center gap-4 p-4">
      <h1 className="text-xl font-semibold">Vehicle Registration Upload</h1>

      <div className="flex flex-col gap-2 w-full max-w-md">
        <label className="font-medium">Address Proof</label>
        <input type="file" onChange={handleFileChange(setAddressProof)} />

        <label className="font-medium">Purchase Invoice</label>
        <input type="file" onChange={handleFileChange(setInvoice)} />

        <label className="font-medium">Chasis & Engine Number</label>
        <input type="file" onChange={handleFileChange(setChasisEngine)} />

        <label className="font-medium">PAN Card</label>
        <input type="file" onChange={handleFileChange(setPanCard)} />
      </div>

      <button
        type="button"
        disabled={uploading}
        onClick={uploadFiles}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload All Files"}
      </button>

      {ipfsHash && (
        <div className="mt-4 p-2 border rounded-md bg-gray-50 w-full max-w-md break-all">
          <p className="font-medium">IPFS Hash:</p>
          <p>{ipfsHash}</p>
          {url && (
            <>
              <p className="font-medium mt-2">Preview (via gateway):</p>
              <ul className="list-disc ml-5">
                <li>Address Proof: <a href={url} target="_blank">{url}</a></li>
              </ul>
            </>
          )}
          <Button onClick={handleVehicleRegistration(ipfsHash)}>Send Vehicle Registration</Button>
        </div>
      )}
    </main>
  );
}
