"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/layout/PageHeader";
import { FilePenLine } from "lucide-react";
import { updateRequest } from "@/app/(app)/dashboard/general-requests/actions";
import GeneralRequestForm from "@/components/form/GeneralRequestForm";

const EditRequestPage = ({ requestData }) => {
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    try {
      const response = await updateRequest(data, requestData.id);
      if (!response.success || !response.data) {
        throw new Error("Failed to update request");
      }
      toast({
        title: "Success",
        description: "Request updated successfully",
        variant: "success",
      });
      router.push("/dashboard/general-requests");
    } catch (error) {
      console.error("Failed to update request:", error);
      toast({
        title: "Error",
        description: "Failed to update request",
        variant: "destructive",
      });
    }
  };

  const cancelRoute = () => router.push("/dashboard/general-requests");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-fade-in">
      <PageHeader
        title="Edit Request"
        subtitle="Update the request information below"
        icon={<FilePenLine className="h-8 w-8" />}
      />
      <div className="max-w-6xl mx-auto">
        <GeneralRequestForm
          defaultValues={requestData}
          onSubmit={onSubmit}
          submitText="Update Request"
          cancelRoute={cancelRoute}
        />
      </div>
    </div>
  );
};

export default EditRequestPage;