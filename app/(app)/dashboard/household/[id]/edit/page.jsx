"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/layout/PageHeader";
import { FilePenLine } from "lucide-react";
import HouseholdForm from "@/components/form/HouseholdForm";

// Dummy function to simulate data fetching.
async function fetchHousehold(id) {
  // Replace with your actual data fetching logic.
  return {
    familyName: "De la Cruz",
    members: [{
      name: "Juan"
    },
    {
      name: "Maria"
    },
    {
      name: "Pedro"
    }
  ],
    localAddress: "123 Main St.",
    status: "Active",
    residencyDate: new Date(),
  };
}

const EditHousehold = ({ recordId }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [defaultValues, setDefaultValues] = React.useState(null);

  useEffect(() => {
    async function loadHousehold() {
      try {
        const permitData = await fetchHousehold(recordId);
        setDefaultValues(permitData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load request data",
          variant: "destructive",
        });
      }
    }
    loadHousehold();
  }, [recordId, toast]);

  const onSubmit = async (data) => {
    try {
      console.log("Updated request data:", data);
      // Insert API call for updating the permit here.
      toast({
        title: "Success",
        description: "Request updated successfully",
      });
      router.push("/dashboard/household");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update business permit request",
        variant: "destructive",
      });
    }
  };

  const cancelRoute = () => router.push("/dashboard/household");

  // Optionally, you can show a loading state until defaultValues are loaded.
  if (!defaultValues) return <div>Loading...</div>;

  return (
    <div className="max-w-screen mx-auto p-4">
    <PageHeader
        title="Edit Household Record"
        subtitle="Update the form below to edit the household record"
        icon={<FilePenLine className="h-8 w-8" />}
        />
      <HouseholdForm
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        submitText="Update Request"
        cancelRoute={cancelRoute}
      />
    </div>
  );
};

export default EditHousehold;
