"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { uploadFilesToServer } from "@/lib/uploadFile";
import { approveVehicleRegistration } from "@/contract/vehicleRegistryWallet";

interface ApproveDialogProps {
  requestId: string;
}

export default function ApproveDialog({ requestId }: ApproveDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setStatusMessage("Please select a vehicle certificate file.");
      setStatusType("error");
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const data = await uploadFilesToServer({ vehicleCertificate: file }, "/api/certfile");
      const ipfsHash = data.ipfsHash;
      await approveVehicleRegistration(requestId, ipfsHash);
      setStatusMessage("Vehicle approved successfully!");
      setStatusType("success");
    } catch (err) {
      console.error(err);
      setStatusMessage("Error approving vehicle.");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Approve Vehicle</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Approve Vehicle Registration</DialogTitle>
          <DialogDescription>
            Upload the vehicle certificate to approve this registration.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="certificate" className="font-medium">
              Vehicle Certificate
            </label>
            <Input
              type="file"
              id="certificate"
              accept=".pdf,.png,.jpg"
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
              required
              disabled={loading}
            />
          </div>

          {statusMessage && (
            <p
              className={`text-sm mt-2 ${
                statusType === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {statusMessage}
            </p>
          )}

          <DialogFooter className="flex justify-between">
            <DialogClose asChild>
              <Button variant="outline" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading || !file}>
              {loading ? "Approving..." : "Approve"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
