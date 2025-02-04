"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { useToast } from "@/components/ui/use-toast";
import { BadgePlus } from "lucide-react";
import GeneralRequestForm from "@/components/form/GeneralRequestForm";

const NewGeneralRequest = () => {
  const router = useRouter();
  const { toast } = useToast();

  const defaultValues = {
    type: "indigencyCertificate",
    status: "pending",
    personalData: {
      firstName: "",
      middleName: "",
      lastName: "",
      birthDate: "",
      localAddress: "",
      sex: "male",
      citizenship: "Filipino",
      maritalStatus: "single",
      residencyStatus: "living with family/relatives",
      lifeStatus: "alive",
      contactNo: [],
    },
    supportingDocuments: [],
    indigencyCertificate: {
      purpose: "",
    },
    barangayClearance: {
      purpose: "",
    },
    barangayResidency: {
      purpose: "",
      duration: "",
    },
  };

  const onSubmit = async (data) => {
    try {
      console.log("Form data:", data);
      toast({
        title: "Success",
        description: "General request submitted successfully",
      });
      router.push("/dashboard/requests/general-requests");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit general request",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="max-w-screen">
        <PageHeader
          title="New General Request"
          subtitle="Fill in the form below to create a new general request"
          icon={<BadgePlus className="h-8 w-8" />}
        />
        <GeneralRequestForm
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          cancelRoute={() =>
            router.push("/dashboard/general-requests")
          }
        />
      </div>
    </>
  );
};

export default NewGeneralRequest;
