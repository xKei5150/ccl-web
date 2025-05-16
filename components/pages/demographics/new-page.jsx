"use client";

import { useState } from "react";
import DemographicForm from "@/components/forms/demographic-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/layout/PageHeader";
import { UsersRound, ArrowLeft } from "lucide-react";
import { createDemographic, checkYearExists } from "@/app/(app)/dashboard/demographics/actions";
import { Button } from "@/components/ui/button";

const DemographicsNewPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [yearError, setYearError] = useState(null);

  const onSubmit = async (data) => {
    try {
      // First check if the year exists
      const yearCheck = await checkYearExists(data.year);
      if (yearCheck.exists) {
        setYearError(`A demographic record for year ${data.year} already exists`);
        toast({
          title: "Year already exists",
          description: `A demographic record for year ${data.year} already exists.`,
          variant: "destructive",
        });
        return;
      }

      // If year is unique, proceed with creating the record
      const response = await createDemographic(data);
      if (!response.success) {
        // Check if it's a year uniqueness error (might happen if someone else created a record with this year in the meantime)
        if (response.statusCode === 409) {
          setYearError(response.message);
          toast({
            title: "Year already exists",
            description: response.message,
            variant: "destructive",
          });
          return;
        }
        throw new Error(response.message);
      }
      
      toast({
        title: "Success",
        description: "Demographic record created successfully",
        variant: "success",
      });
      router.push("/dashboard/demographics");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create demographic record",
        variant: "destructive",
      });
    }
  };

  const handleYearChange = async (year) => {
    if (year) {
      const result = await checkYearExists(year);
      if (result.exists) {
        setYearError(`A demographic record for year ${year} already exists`);
      } else {
        setYearError(null);
      }
    } else {
      setYearError(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-fade-in">
      <PageHeader
        title="New Demographic Record"
        subtitle="Add demographic data for a specific year"
        icon={<UsersRound className="h-8 w-8" />}
      >
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => router.push('/dashboard/demographics')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to List
        </Button>
      </PageHeader>
      <div className="max-w-6xl mx-auto">
        <DemographicForm
          onSubmit={onSubmit}
          submitText="Create Record"
          cancelRoute={() => router.push("/dashboard/demographics")}
          yearError={yearError}
          onYearChange={handleYearChange}
        />
      </div>
    </div>
  );
};

export default DemographicsNewPage; 