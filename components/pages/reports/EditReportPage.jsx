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

  // Format the report data for the form
  const formattedReportData = {
    ...reportData,
    // Ensure date is in the correct format
    date: reportData.date ? new Date(reportData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    
    // Ensure the involvedPersons array is properly formatted
    involvedPersons: Array.isArray(reportData.involvedPersons) 
      ? reportData.involvedPersons.map(person => ({
          name: person.name || '',
          role: person.role || '',
          statement: person.statement || '',
          personalInfo: person.personalInfo || ''
        }))
      : [],
    
    // Ensure supportingDocuments is properly formatted
    supportingDocuments: Array.isArray(reportData.supportingDocuments) 
      ? reportData.supportingDocuments
      : []
  };

  const onSubmit = async (data) => {
    try {
      // Ensure we're passing the ID from the original report data
      const updateData = {
        ...data,
        id: reportData.id
      };
      
      const response = await updateReport(updateData, reportData.id);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to update report");
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
        description: error.message || "Failed to update report",
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
          defaultValues={formattedReportData}
          onSubmit={onSubmit}
          submitText="Update Report"
          cancelRoute={cancelRoute}
        />
      </div>
    </div>
  );
};

export default EditReportPage;