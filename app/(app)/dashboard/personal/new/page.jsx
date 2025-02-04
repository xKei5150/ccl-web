"use client";

import React from "react";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { useToast } from "@/components/ui/use-toast";
import { BadgePlus } from "lucide-react";
import PersonalForm from "@/components/form/PersonalForm";

const NewPersonalRecord = () => {
  const router = useRouter();
  const { toast } = useToast();

  const defaultValues = {
    firstName: "",
    lastName: "",
    middleName: "",
    emailAddress: "",
    localAddress: "",
    sex: "male",
    citizenship: "Filipino",
    maritalStatus: "single",
    residencyStatus: "living with family/relatives",
    lifeStatus: "alive",
    contactNo: [],
    photo: "",
    birthDate: null,
  };

  const onSubmit = async (data) => {
    try {
      console.log("Form data:", data);
      toast({
        title: "Success",
        description: "Personal record created successfully",
      });
      router.push("/dashboard/personal");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create personal record",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-screen">
        <PageHeader
          title="New Personal Record"
          subtitle="Fill in the form below to create a new personal record"
          icon={<BadgePlus className="h-8 w-8" />}
        />
        <PersonalForm
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          cancelRoute={() => router.push("/dashboard/personal")}
        />
      </div>
    </div>
  );
};

export default NewPersonalRecord;
