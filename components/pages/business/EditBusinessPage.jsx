// EditBusiness.jsx
"use client";

import React from "react";
import BusinessForm from "@/components/form/BusinessForm";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/layout/PageHeader";
import { Building2, PenSquare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateBusiness } from "@/app/(app)/dashboard/business/actions";


const EditBusinessPage = ({ businessData }) => {
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    try {
      const response = await updateBusiness(data, businessData.id);
      if(!response.success || !response.data) {
        throw new Error("Failed to update business record");
      }
      toast({
        title: "Success",
        description: "Business record updated successfully",
        variant: "success",
      });
      router.push(`/dashboard/business/${businessData.id}`);
    } catch (error) {
      console.error("Failed to update business record:", error);
      toast({
        title: "Error",
        description: "Failed to update business record",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-fade-in">
      <PageHeader
        title="Edit Business Information"
        subtitle="Update business details"
        icon={<PenSquare className="h-8 w-8" />}
      >
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => router.push(`/dashboard/business/${businessData.id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Business
        </Button>
      </PageHeader>
      <BusinessForm
        defaultValues={businessData}
        onSubmit={onSubmit}
        submitText="Update Record"
        cancelRoute={() => router.push(`/dashboard/business/${businessData.id}`)}
      />
    </div>
  );
};

export default EditBusinessPage;
