// EditGeneralRequest.jsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/layout/PageHeader";
import { FilePenLine } from "lucide-react";
import GeneralRequestForm from "@/components/form/GeneralRequestForm";

// Dummy function to simulate data fetching.
async function fetchGeneralRequest(id) {
  // Replace with your actual data fetching logic.
  return {
    personalData: {
      firstName: "John",
        middleName: "Doe",
        lastName: "Smith",
        birthDate: "1990-01-01",
        sex: "male",
        maritalStatus: "single",
        citizenship: "Filipino",
        localAddress: "123 Main St."
    },
    type: "indigencyCertificate",
    status: "pending",
    supportingDocuments: [],
    purpose: "Medical assistance",
    indigencyCertificate: {
      forWhom: ""
    },
  };
}

const EditGeneralRequest = ({ requestId }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [defaultValues, setDefaultValues] = React.useState(null);

  useEffect(() => {
    async function loadPermit() {
      try {
        const permitData = await fetchGeneralRequest(requestId);
        setDefaultValues(permitData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load request data",
          variant: "destructive",
        });
      }
    }
    loadPermit();
  }, [requestId, toast]);

  const onSubmit = async (data) => {
    try {
      console.log("Updated request data:", data);
      // Insert API call for updating the permit here.
      toast({
        title: "Success",
        description: "Request updated successfully",
      });
      router.push("/dashboard/general-requests");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update business permit request",
        variant: "destructive",
      });
    }
  };

  const cancelRoute = () => router.push("/dashboard/general-requests");

  // Optionally, you can show a loading state until defaultValues are loaded.
  if (!defaultValues) return <div>Loading...</div>;

  return (
    <div className="max-w-screen mx-auto p-4">
    <PageHeader
        title="Edit General Request"
        subtitle="Update the form below to edit the general request"
        icon={<FilePenLine className="h-8 w-8" />}
        />
      <GeneralRequestForm
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        submitText="Update Request"
        cancelRoute={cancelRoute}
      />
    </div>
  );
};

export default EditGeneralRequest;
