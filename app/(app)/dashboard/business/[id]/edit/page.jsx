// EditBusiness.jsx
"use client";

import React, { useEffect } from "react";
import BusinessForm from "@/components/form/BusinessForm";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/layout/PageHeader";
import { FilePenLine } from "lucide-react";

// Dummy function to simulate data fetching.
async function fetchBusiness(id) {
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
  };
}

const EditBusiness = () => {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [defaultValues, setDefaultValues] = React.useState(null);

  useEffect(() => {
    async function loadBusiness() {
      try {
        const permitData = await fetchBusiness(params.id);
        setDefaultValues(permitData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load record data",
          variant: "destructive",
        });
      }
    }
    loadBusiness();
  }, [params.id, toast]);

  const onSubmit = async (data) => {
    try {
      console.log("Updated record data:", data);
      // Insert API call for updating the permit here.
      toast({
        title: "Success",
        description: "Business record updated successfully",
      });
      router.push("/business-permits");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update business record request",
        variant: "destructive",
      });
    }
  };

  const cancelRoute = () => router.push("/dashboard/business");

  // Optionally, you can show a loading state until defaultValues are loaded.
  if (!defaultValues) return <div>Loading...</div>;

  return (
    <div className="max-w-screen mx-auto p-4">
    <PageHeader
        title="Edit Business Information"
        subtitle="Update the business information below"
        icon={<FilePenLine className="h-8 w-8" />}
        />
      <BusinessForm
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        submitText="Update Record"
        cancelRoute={cancelRoute}
      />
    </div>
  );
};

export default EditBusiness;
