// EditBusiness.jsx
"use client";

import React from "react";
import BusinessForm from "@/components/form/BusinessForm";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/layout/PageHeader";
import { FilePenLine } from "lucide-react";

import { updateBusiness } from "@/app/(app)/dashboard/business/actions";


const EditBusinessPage = ({ businessData }) => {
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    try {
      console.log("Updated record data:", data);
      const response = await updateBusiness(data, businessData.id);
      if(!response.success || !response.data) {
        throw new Error("Failed to update business record");
      }
      toast({
        title: "Success",
        description: "Business record updated successfully",
      });
      router.push("/dashboard/business");
    } catch (error) {
      console.error("Failed to update business record:", error);
      toast({
        title: "Error",
        description: "Failed to update business record request",
        variant: "destructive",
      });
    }
  };

  const cancelRoute = () => router.push("/dashboard/business");


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-fade-in">
    <PageHeader
        title="Edit Business Information"
        subtitle="Update the business information below"
        icon={<FilePenLine className="h-8 w-8" />}
        />
      <BusinessForm
        defaultValues={businessData}
        onSubmit={onSubmit}
        submitText="Update Record"
        cancelRoute={cancelRoute}
      />
    </div>
  );
};

export default EditBusinessPage;
