"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Home, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import HouseholdForm from "@/components/form/HouseholdForm";
import { createHousehold } from "@/app/(app)/dashboard/household/actions";
import { Button } from "@/components/ui/button";

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
        variant: "success",
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-fade-in">
      <PageHeader
        title="New Household Record"
        subtitle="Create a new household record"
        icon={<Home className="h-8 w-8" />}
      >
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => router.push('/dashboard/household')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to List
        </Button>
      </PageHeader>
      <div className="max-w-6xl mx-auto">
        <HouseholdForm
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          submitText="Create Record"
          cancelRoute={() => router.push("/dashboard/household")}
        />
      </div>
    </div>
  );
}