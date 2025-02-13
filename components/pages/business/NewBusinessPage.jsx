"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { useToast } from "@/components/ui/use-toast";
import { BadgePlus } from "lucide-react";
import BusinessForm from "@/components/form/BusinessForm";
import { createBusiness } from "@/app/(app)/dashboard/business/actions";

export default function NewBusinessPage() {
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    try {
      console.log("New business permit data:", data);
      const response = await createBusiness(data);
      if (!response.success) {
        throw new Error(response.message);
      }
      toast({
        title: "Success",
        description: "Business permit request submitted successfully",
        variant: "success",
      });
      router.push("/dashboard/business");
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to submit business permit request: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const cancelRoute = () => router.push("/dashboard/business");

  return (
    <>
      <div className="max-w-screen mx-auto p-4">
        <PageHeader
          title="Create Business Record"
          subtitle="Fill in the form below to create a new business record"
          icon={<BadgePlus className="h-8 w-8" />}
        />
        <BusinessForm
          onSubmit={onSubmit}
          submitText="Submit Record"
          cancelRoute={cancelRoute}
        />
      </div>
    </>
  );
}
