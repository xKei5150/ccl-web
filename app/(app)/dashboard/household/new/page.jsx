"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";

import { BadgePlus } from "lucide-react";
import { householdSchema } from "@/lib/schema";
import { useToast } from "@/components/ui/use-toast";
import HouseholdForm from "@/components/form/HouseholdForm";
const NewHouseholdRecord = () => {
  const router = useRouter();
  const { toast } = useToast();

  const defaultValues = {
    familyName: "",
    members: [],
    localAddress: "",
    status: "",
    residencyDate: new Date(),
  };

  const onSubmit = async (data) => {
    try {
      console.log("Form data:", data);
      toast({
        title: "Success",
        description: "Household record created successfully",
      });
      router.push("/household");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create household record",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="max-w-screen">
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
    </>
  );
};

export default NewHouseholdRecord;
