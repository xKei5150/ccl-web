"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/layout/PageHeader";
import { BadgePlus } from "lucide-react";
import { createRequest } from "@/app/(app)/dashboard/general-requests/actions";
import GeneralRequestForm from "@/components/form/GeneralRequestForm";

const NewRequestPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data) => {
    try {
      const response = await createRequest(data);
      if (!response.success) {
        throw new Error(response.message);
      }
      toast({
        title: "Success",
        description: "Request submitted successfully",
        variant: "success",
      });
      router.push("/dashboard/general-requests");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request",
        variant: "destructive",
      });
    }
  };

  const cancelRoute = () => router.push("/dashboard/general-requests");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-fade-in">
      <PageHeader
        title="New Request"
        subtitle="Submit a new request"
        icon={<BadgePlus className="h-8 w-8" />}
      />
      <div className="max-w-6xl mx-auto">
        <GeneralRequestForm
          onSubmit={handleSubmit}
          submitText="Submit Request"
          cancelRoute={cancelRoute}
        />
      </div>
    </div>
  );
};

export default NewRequestPage;