// EditReport.jsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/layout/PageHeader";
import { FilePenLine } from "lucide-react";
import ReportForm from "@/components/form/ReportForm";

// Dummy function to simulate data fetching.
async function fetchReport(id) {
  // Replace with your actual data fetching logic.
  return {
    title: "Incident Report",
    date: "2023-10-01",
    description: "Description of the incident.",
    location: "Location of the incident.",
    involvedPersons: [
      {
        name: "John Doe",
        role: "complainant",
        statement: "Statement from John Doe.",
      },
      {
        name: "Jane Smith",
        role: "respondent",
        statement: "Statement from Jane Smith.",
      },
      {
        name: "Alice Johnson",
        role: "witness",
        statement: "Statement from Alice Johnson.",
      },
    ],
    supportingDocuments: [
      {
        name: "Document 1",
        url: "http://example.com/document1.pdf",
      },
      {
        name: "Document 2",
        url: "http://example.com/document2.pdf",
      },
    ],
  };
}

const EditReport = ({ reportId }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [defaultValues, setDefaultValues] = React.useState(null);

  useEffect(() => {
    async function loadReport() {
      try {
        const permitData = await fetchReport(reportId);
        setDefaultValues(permitData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load request data",
          variant: "destructive",
        });
      }
    }
    loadReport();
  }, [reportId, toast]);

  const onSubmit = async (data) => {
    try {
      console.log("Updated report data:", data);
      // Insert API call for updating the permit here.
      toast({
        title: "Success",
        description: "Report updated successfully",
      });
      router.push("/dashboard/reports");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update business permit request",
        variant: "destructive",
      });
    }
  };

  const cancelRoute = () => router.push("/dashboard/reports");

  // Optionally, you can show a loading state until defaultValues are loaded.
  if (!defaultValues) return <div>Loading...</div>;

  return (
    <div className="max-w-screen mx-auto p-4">
      <PageHeader
        title="Edit Report"
        subtitle="Update the form below to edit the report"
        icon={<FilePenLine className="h-8 w-8" />}
      />
      <ReportForm
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        submitText="Update Report"
        cancelRoute={cancelRoute}
      />
    </div>
  );
};

export default EditReport;
