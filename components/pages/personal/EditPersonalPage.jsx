"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/layout/PageHeader";
import { FilePenLine } from "lucide-react";
import { updatePersonalRecord } from "@/app/(app)/dashboard/personal/actions";
import PersonalForm from "@/components/form/PersonalForm";

const EditPersonalPage = ({ data }) => {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (formData) => {
    try {
      const response = await updatePersonalRecord(formData, data.id);
      if (!response.success || !response.data) {
        throw new Error("Failed to update personal record");
      }
      toast({
        title: "Success",
        description: "Personal record updated successfully",
        variant: "success",
      });
      router.push("/dashboard/personal");
    } catch (error) {
      console.error("Failed to update personal record:", error);
      toast({
        title: "Error",
        description: "Failed to update personal record",
        variant: "destructive",
      });
    }
  };

  const cancelRoute = () => router.push("/dashboard/personal");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-fade-in">
      <PageHeader
        title="Edit Personal Record"
        subtitle="Update personal record information"
        icon={<FilePenLine className="h-8 w-8" />}
      />
      <div className="max-w-6xl mx-auto">
        <PersonalForm
          defaultValues={data}
          onSubmit={handleSubmit}
          submitText="Update Record"
          cancelRoute={cancelRoute}
        />
      </div>
    </div>
  );
};

export default EditPersonalPage;