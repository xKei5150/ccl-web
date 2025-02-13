// EditBusinessPermit.jsx
"use client";

import React, { useEffect } from "react";
import BusinessPermitForm from "@/components/form/BusinessPermitForm";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/layout/PageHeader";
import { FilePenLine } from "lucide-react";
import { updateBusinessPermit } from "@/app/(app)/dashboard/business-permits/actions";


const EditBusinessPermit = ({ businessPermitData, businesses }) => {
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    try {
      console.log("Updated permit data:", data);
      const response = await updateBusinessPermit(data, businessPermitData.id);
      if(!response.success || !response.data) {
        throw new Error("Failed to update business permit");
      }
      toast({
        title: "Success",
        description: "Business permit updated successfully",
        variant: "success",
      });
      router.push("/dashboard/business-permits");
    } catch (error) {
      console.error("Failed to update business permit:", error);
      toast({
        title: "Error",
        description: "Failed to update business permit request",
        variant: "destructive",
      });
    }
  };


  const cancelRoute = () => router.push("/dashboard/business-permits");

  return (
    <div className="max-w-screen mx-auto p-4">
    <PageHeader
        title="Edit Business Permit"
        subtitle="Update the form below to edit the business permit request"
        icon={<FilePenLine className="h-8 w-8" />}
        />
      <BusinessPermitForm
        defaultValues={businessPermitData}
        businesses={businesses}
        onSubmit={onSubmit}
        submitText="Update Request"
        cancelRoute={cancelRoute}
      />
    </div>
  );
};

export default EditBusinessPermit;
