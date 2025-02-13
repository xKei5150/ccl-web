"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/layout/PageHeader";
import { BadgePlus } from "lucide-react";
import { createPersonalRecord } from "@/app/(app)/dashboard/personal/actions";
import PersonalForm from "@/components/form/PersonalForm";

const NewPersonalPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data) => {
    try {
      const response = await createPersonalRecord(data);
      if (!response.success) {
        throw new Error(response.message);
      }
      toast({
        title: "Success",
        description: "Personal record created successfully",
        variant: "success",
      });
      router.push("/dashboard/personal");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create personal record",
        variant: "destructive",
      });
    }
  };

  const cancelRoute = () => router.push("/dashboard/personal");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-fade-in">
      <PageHeader
        title="New Personal Record"
        subtitle="Create a new personal record"
        icon={<BadgePlus className="h-8 w-8" />}
      />
      <div className="max-w-6xl mx-auto">
        <PersonalForm
          onSubmit={handleSubmit}
          submitText="Create Record"
          cancelRoute={cancelRoute}
        />
      </div>
    </div>
  );
};

export default NewPersonalPage;