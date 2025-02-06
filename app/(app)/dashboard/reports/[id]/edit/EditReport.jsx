// app/dashboard/reports/[id]/EditReport.jsx (Client Component)
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/layout/PageHeader";
import { FilePenLine } from "lucide-react";
import ReportForm from "@/components/form/ReportForm";
import { updateReport } from "@/app/(app)/dashboard/reports/actions";

export default function EditReport({ report, id }) {
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    const result = await updateReport(data, id);

    if (result.success) {
      toast({
        title: "Success",
        description: "Report updated successfully",
      });
      router.push(`/dashboard/reports/${id}`);
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to update report",
        variant: "destructive",
      });
    }
  };

  const cancelRoute = () => router.push("/dashboard/reports");

  return (
    <div className="max-w-screen mx-auto p-4">
      <PageHeader
        title="Edit Report"
        subtitle="Update the form below to edit the report"
        icon={<FilePenLine className="h-8 w-8" />}
      />
      <ReportForm
        defaultValues={report}
        onSubmit={onSubmit} // Use the local onSubmit handler
        submitText="Update Report"
        cancelRoute={cancelRoute}
      />
    </div>
  );
}