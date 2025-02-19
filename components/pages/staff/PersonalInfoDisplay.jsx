"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Unlink } from "lucide-react";
import { useStaffManagement } from "@/hooks/use-staff-management";
import { ConfirmationDialog } from "@/components/layout/ConfirmationDialog";
import { useState } from "react";

export function PersonalInfoDisplay({ info, staff, onUnlink }) {
  const [showUnlinkDialog, setShowUnlinkDialog] = useState(false);
  const { handleLinkPersonalInfo, isLoading } = useStaffManagement();

  const handleUnlink = async () => {
    try {
      await handleLinkPersonalInfo(staff.id, null);
      onUnlink?.();
    } catch {
      // Error is handled by the hook
    }
    setShowUnlinkDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Personal Information</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowUnlinkDialog(true)}
          disabled={isLoading}
        >
          <Unlink className="h-4 w-4 mr-2" />
          Unlink Info
        </Button>
      </div>

      <Card>
        <CardHeader className="text-lg font-semibold">Personal Details</CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {info.name && Object.entries(info.name).map(([key, value]) => (
            key !== 'fullName' && (
              <div key={key}>
                <label className="text-sm font-medium text-gray-500 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <p className="mt-1">{value || "N/A"}</p>
              </div>
            )
          ))}
          {info.demographics && Object.entries(info.demographics).map(([key, value]) => (
            <div key={key}>
              <label className="text-sm font-medium text-gray-500 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <p className="mt-1 capitalize">{value || "N/A"}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-lg font-semibold">Contact Information</CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          {info.contact && Object.entries(info.contact).map(([key, value]) => (
            <div key={key}>
              <label className="text-sm font-medium text-gray-500 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <p className="mt-1">{value || "N/A"}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-lg font-semibold">Status Information</CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {info.status && Object.entries(info.status).map(([key, value]) => (
            <div key={key}>
              <label className="text-sm font-medium text-gray-500 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <p className="mt-1 capitalize">{value || "N/A"}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={showUnlinkDialog}
        onOpenChange={setShowUnlinkDialog}
        title="Unlink Personal Information"
        description="Are you sure you want to unlink this personal information from the staff member? This action can be undone later."
        onConfirm={handleUnlink}
        loading={isLoading}
      />
    </div>
  );
}