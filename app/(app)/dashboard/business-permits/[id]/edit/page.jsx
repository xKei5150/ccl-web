// EditBusinessPermit.jsx
"use client";

import React, { useEffect } from "react";
import BusinessPermitForm from "@/components/form/BusinessPermitForm";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/layout/PageHeader";
import { FilePenLine } from "lucide-react";

// Dummy function to simulate data fetching.
async function fetchBusinessPermit(id) {
  // Replace with your actual data fetching logic.
  return {
    businessData: {
      businessName: "Acme Corporation",
      address: "123 Main St, Cityville",
      registrationDate: new Date("2023-01-01"),
      eligibility: new Date("2023-02-01"),
      typeOfOwnership: "corporation",
      owners: ["Alice Smith", "Bob Jones"],
      typeOfCorporation: "private",
      businessContactNo: "09123456789",
      businessEmailAddress: "contact@acme.com",
      supportingDocuments: [],
    },
    validity: new Date("2024-01-01"),
    officialReceiptNo: "OR-123456",
    issuedTo: "Acme Corporation",
    amount: 5000,
  };
}

const EditBusinessPermit = ({ permitId }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [defaultValues, setDefaultValues] = React.useState(null);

  useEffect(() => {
    async function loadPermit() {
      try {
        const permitData = await fetchBusinessPermit(permitId);
        setDefaultValues(permitData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load permit data",
          variant: "destructive",
        });
      }
    }
    loadPermit();
  }, [permitId, toast]);

  const onSubmit = async (data) => {
    try {
      console.log("Updated permit data:", data);
      // Insert API call for updating the permit here.
      toast({
        title: "Success",
        description: "Business permit request updated successfully",
      });
      router.push("/business-permits");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update business permit request",
        variant: "destructive",
      });
    }
  };

  const cancelRoute = () => router.push("/dashboard/business-permits");

  // Optionally, you can show a loading state until defaultValues are loaded.
  if (!defaultValues) return <div>Loading...</div>;

  return (
    <div className="max-w-screen mx-auto p-4">
    <PageHeader
        title="Edit Business Permit"
        subtitle="Update the form below to edit the business permit request"
        icon={<FilePenLine className="h-8 w-8" />}
        />
      <BusinessPermitForm
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        submitText="Update Request"
        cancelRoute={cancelRoute}
      />
    </div>
  );
};

export default EditBusinessPermit;
