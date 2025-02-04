// NewBusinessPermit.jsx
"use client";

import BusinessPermitForm from "@/components/form/BusinessPermitForm";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/layout/PageHeader";
import { BadgePlus } from "lucide-react";

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
  validity: new Date(),
  officialReceiptNo: "",
  issuedTo: "",
  amount: 0,
};

const NewBusinessPermit = () => {
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

  const cancelRoute = () => router.push("/dashboard/business-permits");

  return (
    <div className="max-w-screen mx-auto p-4">
        <PageHeader
          title="New Business Permit"
          subtitle="Submit a new business permit request"
          icon={<BadgePlus className="h-8 w-8" />}
        />
      <BusinessPermitForm
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        submitText="Submit Request"
        cancelRoute={cancelRoute}
      />
    </div>
  );
};

export default NewBusinessPermit;
