"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface RoleRequestFormProps {
  onSubmit: (formData: { role: string }) => Promise<void> | void;
}

export default function RoleRequestForm({ onSubmit }: RoleRequestFormProps) {
  const [role, setRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    setIsSubmitting(true);
    try {
      await onSubmit({ role });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-md border rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
          Request a Role
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selector */}
          <div className="space-y-2">
            <Label>Role</Label>
            <Select onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DEALER_ROLE">Dealer</SelectItem>
                <SelectItem value="AUDITOR_ROLE">Auditor</SelectItem>
                <SelectItem value="OWNER_ROLE">Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isSubmitting || !role}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Request"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
