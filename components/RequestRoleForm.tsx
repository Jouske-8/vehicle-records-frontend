"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    // Main Glassmorphism Container
    <Card
      className="w-full max-w-md 
                 rounded-2xl 
                 border border-gray-500/30 
                 bg-white/10 
                 backdrop-blur-lg 
                 shadow-xl
                 text-gray-200" // Default text color
    >
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center text-gray-100">
          Request a Role
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selector */}
          <div className="space-y-2">
            <Label className="text-gray-200 font-medium">Role</Label>
            <Select onValueChange={setRole}>
              {/* Styled trigger for dark/glass theme */}
              <SelectTrigger
                className="w-full bg-gray-700/50 border-gray-500/50 text-gray-100 
                           placeholder:text-gray-400 focus:ring-cyan-300"
              >
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              {/* Styled content for dark/glass theme */}
              <SelectContent
                className="bg-gray-900 text-gray-200 border-gray-500/50"
              >
                <SelectItem
                  value="DEALER_ROLE"
                  className="focus:bg-gray-800 focus:text-gray-100"
                >
                  Dealer
                </SelectItem>
                <SelectItem
                  value="AUDITOR_ROLE"
                  className="focus:bg-gray-800 focus:text-gray-100"
                >
                  Auditor
                </SelectItem>
                <SelectItem
                  value="OWNER_ROLE"
                  className="focus:bg-gray-800 focus:text-gray-100"
                >
                  Owner
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            // Using the blue-cyan-green gradient theme
            className="w-full font-semibold text-gray-900 bg-gradient-to-r from-blue-300 via-cyan-300 to-green-300 hover:from-blue-400 hover:via-cyan-400 hover:to-green-400 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-60"
            disabled={isSubmitting || !role}
          >
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