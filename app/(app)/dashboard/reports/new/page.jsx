"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { BadgePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReportForm from "@/components/form/ReportForm";

const NewReport = () => {
  const router = useRouter();
  const { toast } = useToast();

  const defaultValues = {
    title: "",
    description: "",
    date: new Date(),
    location: "",
    reportStatus: "open",
    involvedPersons: [],
    supportingDocuments: [],
  };

  const onSubmit = async (data) => {
    const uploadedDocuments = [];
    try {
      if (data.supportingDocuments && data.supportingDocuments.length > 0) {
        for (const file of data.supportingDocuments) {
          const documentFormData = new FormData();
          documentFormData.append('file', file.file);
          documentFormData.append('_payload', JSON.stringify({
            "notes": file.notes,
          }));
          const uploadResponse = await fetch('/api/supporting-documents', {
            method: 'POST',
            body: documentFormData,
          });
          
          if (!uploadResponse.ok) {
            throw new Error('Failed to upload document');
          }
          
          const document = await uploadResponse.json();
          uploadedDocuments.push(document.doc.id);
        }
      }

      const reportData = {
        title: data.title,
        description: data.description,
        date: new Date().toISOString(),
        location: data.location,
        involvedPersons: data.involvedPersons,
        supportingDocuments: uploadedDocuments,
        reportStatus: data.reportStatus,
      };

      console.log("reportData", reportData)
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error('Failed to create report');
      }

      toast({
        title: "Success",
        description: "Report submitted successfully",
      });
      router.push("/dashboard/reports");
    } catch (error) {
      if(uploadedDocuments.length > 0) {
        for (const document of uploadedDocuments) {
          await fetch(`/api/supporting-documents/${document}`, { method: 'DELETE' });
        }
      }
      console.error('Error submitting report:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit report",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <PageHeader
        title="New Report"
        subtitle="Fill in the form below to submit a new report"
        icon={<BadgePlus className="h-8 w-8" />}
      />

      <div className="max-w-screen mx-auto mt-8">
        <ReportForm
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          cancelRoute={() =>
            router.push("/dashboard/reports")
          }
        />
      </div>
    </>
  );
};

export default NewReport;
