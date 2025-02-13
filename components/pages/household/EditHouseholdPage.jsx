"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { FilePenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import HouseholdForm from "@/components/form/HouseholdForm";
import { updateHousehold } from "@/app/(app)/dashboard/household/actions";


export default function EditHouseholdPage({ householdData }) {
  const router = useRouter();
  const { toast } = useToast();

  async function onSubmit(data) {
    try {
      await updateHousehold(data, householdData.id);
      toast({
        title: "Success",
        description: "Household record updated successfully",
      });
      router.push("/dashboard/household");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update household record",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="max-w-screen mx-auto p-4">
      <PageHeader
        title="Edit Household Record"
        subtitle="Update the form below to edit the household record"
        icon={<FilePenLine className="h-8 w-8" />}
      />
      <HouseholdForm
        defaultValues={householdData}
        onSubmit={onSubmit}
        submitText="Update Record"
        cancelRoute={() => router.push("/dashboard/household")}
      />
    </div>
  );
}