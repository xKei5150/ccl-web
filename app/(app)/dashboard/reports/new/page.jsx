"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { BadgePlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ReportForm from "@/components/form/ReportForm";

const NewReport = () => {
  const router = useRouter();
  const { toast } = useToast();

  const defaultValues = {
    title: "",
    description: "",
    date: new Date(),
    location: "",
    reportType: "incident",
    status: "pending",
    involvedPersons: [],
    supportingDocuments: [],
  };

  const onSubmit = async (data) => {
    try {
      console.log("Form data:", data);
      toast({
        title: "Success",
        description: "Report submitted successfully",
      });
      router.push("/reports");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit report",
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
