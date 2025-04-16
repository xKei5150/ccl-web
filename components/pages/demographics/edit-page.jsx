"use client";

import { useState } from "react";
import DemographicForm from "@/components/forms/demographic-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/layout/PageHeader";
import { UsersRound, ArrowLeft } from "lucide-react";
import { updateDemographic, checkYearExists } from "@/app/(app)/dashboard/demographics/actions";
import { Button } from "@/components/ui/button";

const DemographicEditPage = ({ demographic, id }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [yearError, setYearError] = useState(null);
  
  // Extract default values from the demographic data
  const defaultValues = {
    year: demographic.year || new Date().getFullYear(),
    maleCount: demographic.maleCount || "",
    femaleCount: demographic.femaleCount || "",
    householdsCount: demographic.householdsCount || "",
    voterCount: demographic.voterCount || "",
    pwdCount: demographic.pwdCount || "",
    ageGroups: demographic.ageGroups?.length > 0 
      ? demographic.ageGroups
      : [
          { ageRange: "0-5", count: "" },
          { ageRange: "6-17", count: "" },
          { ageRange: "18-59", count: "" },
          { ageRange: "60+", count: "" }
        ],
    chronicDiseases: demographic.chronicDiseases || [],
  };

  const onSubmit = async (data) => {
    try {
      // Check if year changed and if the new year exists
      if (data.year !== demographic.year) {
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
      }

      // If year is unique or unchanged, proceed with updating the record
      const response = await updateDemographic(data, id);
      if (!response.success) {
        // Check if it's a year uniqueness error
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
        description: "Demographic record updated successfully",
        variant: "success",
      });
      router.push(`/dashboard/demographics/${id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update demographic record",
        variant: "destructive",
      });
    }
  };

  const cancelRoute = () => router.push(`/dashboard/demographics/${id}`);

  const handleYearChange = async (year) => {
    // Only check if year has changed from the original
    if (year && year !== demographic.year) {
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
        title={`Edit Demographic Record: ${demographic.year}`}
        subtitle="Update demographic data"
        icon={<UsersRound className="h-8 w-8" />}
      />
      
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/dashboard/demographics/${id}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Details
        </Button>
      </div>
      
      <div className="max-w-6xl mx-auto">
        <DemographicForm
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          submitText="Update Record"
          cancelRoute={cancelRoute}
          yearError={yearError}
          onYearChange={handleYearChange}
        />
      </div>
    </div>
  );
};

export default DemographicEditPage; 