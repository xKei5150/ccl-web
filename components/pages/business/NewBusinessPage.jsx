"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Building2, ArrowLeft } from "lucide-react";
import BusinessForm from "@/components/form/BusinessForm";
import { createBusiness } from "@/app/(app)/dashboard/business/actions";

export default function NewBusinessPage() {
  const router = useRouter();
  const { toast } = useToast();

  async function onSubmit(data) {
    try {
      await createBusiness(data);
      toast({
        title: "Success",
        description: "Business record created successfully",
        variant: "success",
      });
      router.push("/dashboard/business");
    } catch (error) {
      console.error("Failed to create business record:", error);
      toast({
        title: "Error",
        description: "Failed to create business record",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-fade-in">
      <PageHeader
        title="New Business Record"
        subtitle="Register a new business"
        icon={<Building2 className="h-8 w-8" />}
      >
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => router.push('/dashboard/business')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to List
        </Button>
      </PageHeader>
      <BusinessForm
        onSubmit={onSubmit}
        submitText="Create Business"
        cancelRoute={() => router.push("/dashboard/business")}
      />
    </div>
  );
}
