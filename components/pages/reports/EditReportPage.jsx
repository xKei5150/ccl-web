"use client";

import React from "react";
import ReportForm from "@/components/form/ReportForm";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/layout/PageHeader";
import { FilePenLine } from "lucide-react";
import { updateReport } from "@/app/(app)/dashboard/reports/actions";

const EditReportPage = ({ reportData }) => {
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    try {
      const response = await updateReport(data, reportData.id);
      if (!response.success || !response.data) {
        throw new Error("Failed to update report");
      }
      toast({
        title: "Success",
        description: "Report updated successfully",
        variant: "success",
      });
      router.push("/dashboard/reports");
    } catch (error) {
      console.error("Failed to update report:", error);
      toast({
        title: "Error",
        description: "Failed to update report",
        variant: "destructive",
      });
    }
  };

  const cancelRoute = () => router.push("/dashboard/reports");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-fade-in">
      <PageHeader
        title="Edit Report"
        subtitle="Update the report information below"
        icon={<FilePenLine className="h-8 w-8" />}
      />
      <div className="max-w-6xl mx-auto">
        <ReportForm
          defaultValues={reportData}
          onSubmit={onSubmit}
          submitText="Update Report"
          cancelRoute={cancelRoute}
        />
      </div>
    </div>
  );
};

export default EditReportPage;