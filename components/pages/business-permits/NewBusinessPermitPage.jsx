// NewBusinessPermit.jsx
"use client";

import BusinessPermitForm from "@/components/form/BusinessPermitForm";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/layout/PageHeader";
import { BadgePlus } from "lucide-react";
import { createBusinessPermit } from "@/app/(app)/dashboard/business-permits/actions";


const NewBusinessPermitPage = ({businesses}) => {
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    try {
      console.log("New business permit data:", data);
      const response = await createBusinessPermit(data);
      if (!response.success) {
        throw new Error(response.message);
      }
      toast({
        title: "Success",
        description: "Business permit request submitted successfully",
        variant: "success",
      });
      router.push("/dashboard/business-permits");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit business permit request",
        variant: "destructive",
      });
    }
  };

  const cancelRoute = () => router.push("/dashboard/business-permits");

  return (
    <div className="max-w-screen mx-auto p-4">
      <PageHeader
        title="New Business Permit"
        subtitle="Submit a new business permit request"
        icon={<BadgePlus className="h-8 w-8" />}
      />
      <BusinessPermitForm
        businesses={businesses}
        onSubmit={onSubmit}
        submitText="Submit Permit"
        cancelRoute={cancelRoute}
      />
    </div>
  );
};

export default NewBusinessPermitPage;
