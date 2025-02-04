"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { useToast } from "@/components/ui/use-toast";
import { BadgePlus } from "lucide-react";
import BusinessForm from "@/components/form/BusinessForm";

const defaultValues = {
  businessData: {
    businessName: "",
    address: "",
    registrationDate: new Date(),
    eligibility: new Date(),
    typeOfOwnership: "sole proprietorship",
    owners: [""],
    typeOfCorporation: undefined,
    businessContactNo: "",
    businessEmailAddress: "",
    supportingDocuments: [],
  },

};

export default function NewBusinessRecord() {
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    try {
      console.log("New business permit data:", data);
      // Insert API call for creating new permit here.
      toast({
        title: "Success",
        description: "Business permit request submitted successfully",
      });
      router.push("/business-permits");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit business permit request",
        variant: "destructive",
      });
    }
  };

  const cancelRoute = () => router.push("/dashboard/business");


  return (
    <>
    <div className="max-w-screen mx-auto p-4">
      <PageHeader
        title="Create Business Record"
        subtitle="Fill in the form below to create a new business record"
        icon={<BadgePlus className="h-8 w-8" />}
      />
      <BusinessForm
              defaultValues={defaultValues}
              onSubmit={onSubmit}
              submitText="Submit Record"
              cancelRoute={cancelRoute}
      />
       
      </div>
    </>
  );
}