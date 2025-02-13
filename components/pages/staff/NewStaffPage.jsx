"use client";

import { StaffForm } from "@/components/form/StaffForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { Users } from "lucide-react";

export default function NewStaffPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Add Staff Member"
        subtitle="Create a new staff account"
        icon={<Users className="h-8 w-8" />}
      />
      <div className="mt-8">
        <StaffForm />
      </div>
    </div>
  );
}