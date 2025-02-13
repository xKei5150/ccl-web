"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { BadgePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import HouseholdForm from "@/components/form/HouseholdForm";
import { createHousehold } from "@/app/(app)/dashboard/household/actions";

export default function NewHouseholdPage() {
  const router = useRouter();
  const { toast } = useToast();

  const defaultValues = {
    familyName: "",
    members: [],
    localAddress: "",
    status: "active",
    residencyDate: new Date(),
  };

  async function onSubmit(data) {
    try {
      await createHousehold(data);
      toast({
        title: "Success",
        description: "Household record created successfully",
      });
      router.push("/dashboard/household");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create household record",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="max-w-screen mx-auto p-4">
      <PageHeader
        title="New Household Record"
        subtitle="Fill in the form below to create a new household record"
        icon={<BadgePlus className="h-8 w-8" />}
      />
      <HouseholdForm
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        cancelRoute={() => router.push("/dashboard/household")}
      />
    </div>
  );
}