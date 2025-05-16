"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { PenSquare, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import HouseholdForm from "@/components/form/HouseholdForm";
import { updateHousehold } from "@/app/(app)/dashboard/household/actions";
import { Button } from "@/components/ui/button";


export default function EditHouseholdPage({ householdData }) {
  const router = useRouter();
  const { toast } = useToast();

  async function onSubmit(data) {
    try {
      await updateHousehold(data, householdData.id);
      toast({
        title: "Success",
        description: "Household record updated successfully",
        variant: "success",
      });
      router.push(`/dashboard/household/${householdData.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update household record",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-fade-in">
      <PageHeader
        title="Edit Household Record"
        subtitle="Update household information"
        icon={<PenSquare className="h-8 w-8" />}
      >
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => router.push(`/dashboard/household/${householdData.id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Record
        </Button>
      </PageHeader>
      <div className="max-w-6xl mx-auto">
        <HouseholdForm
          defaultValues={householdData}
          onSubmit={onSubmit}
          submitText="Update Record"
          cancelRoute={() => router.push(`/dashboard/household/${householdData.id}`)}
        />
      </div>
    </div>
  );
}