// EditGeneralRequest.jsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/layout/PageHeader";
import { FilePenLine } from "lucide-react";
import PersonalForm from "@/components/form/PersonalForm";

// Dummy function to simulate data fetching.
async function fetchPersonalRecord(id) {
  // Replace with your actual data fetching logic.
  return {
    photo: "http://example.com/photo.jpg",
    firstName: "John",
    middleName: "A.",
    lastName: "Doe",
    emailAddress: "john.doe@example.com",
    localAddress: "123 Main St, Anytown, USA",
    sex: "male",
    birthDate: new Date("1990-01-01"),
    maritalStatus: "single",
    residencyStatus: "renting",
    lifeStatus: "alive",
  };
}

const EditPersonalRecord = ({ requestId }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [defaultValues, setDefaultValues] = React.useState(null);

  useEffect(() => {
    async function loadRecord() {
      try {
        const permitData = await fetchPersonalRecord(requestId);
        setDefaultValues(permitData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load request data",
          variant: "destructive",
        });
      }
    }
    loadRecord();
  }, [requestId, toast]);

  const onSubmit = async (data) => {
    try {
      console.log("Updated request data:", data);
      // Insert API call for updating the permit here.
      toast({
        title: "Success",
        description: "Request updated successfully",
      });
      router.push("/dashboard/personal");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update business permit request",
        variant: "destructive",
      });
    }
  };

  const cancelRoute = () => router.push("/dashboard/personal");

  // Optionally, you can show a loading state until defaultValues are loaded.
  if (!defaultValues) return <div>Loading...</div>;

  return (
    <div className="max-w-screen mx-auto p-4">
    <PageHeader
        title="Edit Personal Record"
        subtitle="Update the form below to edit the personal record"
        icon={<FilePenLine className="h-8 w-8" />}
        />
      <PersonalForm
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        submitText="Update Record"
        cancelRoute={cancelRoute}
      />
    </div>
  );
};

export default EditPersonalRecord;
