// @/components/pages/business/BusinessPage.jsx
"use client";

import { Building2 } from "lucide-react";
import { deleteBusiness } from "@/app/(app)/dashboard/business/actions";
import DataPageLayout from "@/components/layout/DataPageLayout";

const BusinessPage = ({ data }) => {
  const columns = [
    {
      accessorKey: "businessName",
      header: "Business Name",
    },
    {
      accessorKey: "address",
      header: "Address",
    },
    {
      accessorKey: "registrationDate",
      header: "Registration Date",
      cell: (row) => new Date(row.registrationDate).toLocaleDateString(),
    },
    {
      accessorKey: "businessEmailAddress",
      header: "Business Email",
    },
  ];

  return (
    <DataPageLayout
      title="Business Information"
      subtitle="View and manage business information"
      icon={Building2}
      columns={columns}
      data={data}
      baseUrl="/dashboard/business"
      newItemUrl="/dashboard/business/new"
      deleteAction={deleteBusiness}
      newButtonLabel="New Business"
    />
  );
};

export default BusinessPage;
