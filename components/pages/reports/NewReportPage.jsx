"use client";

import ReportForm from "@/components/form/ReportForm";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/layout/PageHeader";
import { BadgePlus } from "lucide-react";
import { createReport } from "@/app/(app)/dashboard/reports/actions";

const NewReportPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    try {
      const response = await createReport(data);
      if (!response.success) {
        throw new Error(response.message);
      }
      toast({
        title: "Success",
        description: "Report submitted successfully",
        variant: "success",
      });
      router.push("/dashboard/reports");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit report",
        variant: "destructive",
      });
    }
  };

  const cancelRoute = () => router.push("/dashboard/reports");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-fade-in">
      <PageHeader
        title="New Report"
        subtitle="Submit a new incident report"
        icon={<BadgePlus className="h-8 w-8" />}
      />
      <div className="max-w-6xl mx-auto">
        <ReportForm
          onSubmit={onSubmit}
          submitText="Submit Report"
          cancelRoute={cancelRoute}
        />
      </div>
    </div>
  );
};

export default NewReportPage;