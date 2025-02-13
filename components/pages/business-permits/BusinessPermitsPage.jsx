// @/components/pages/business/BusinessPermitsPage.jsx
"use client";

import { Tickets } from "lucide-react";
import { deleteBusinessPermit } from "@/app/(app)/dashboard/business-permits/actions";
import DataPageLayout from "@/components/layout/DataPageLayout";

const BusinessPermitsPage = ({ data }) => {
  const columns = [
    {
      accessorKey: "business.businessName",
      header: "Business Name",
    },
    {
      accessorKey: "business.businessEmailAddress",
      header: "Business Email",
    },
    {
      accessorKey: "officialReceiptNo",
      header: "Official Receipt No",
    },
    {
      accessorKey: "validity",
      header: "Validity",
      cell: (row) => new Date(row.validity).toLocaleDateString(),
    },
  ];

  return (
    <DataPageLayout
      title="Business Permits"
      subtitle="View and manage business permits"
      icon={Tickets}
      columns={columns}
      data={data}
      baseUrl="/dashboard/business-permits"
      newItemUrl="/dashboard/business-permits/new"
      deleteAction={deleteBusinessPermit}
      newButtonLabel="New Business"
    />
  );
};

export default BusinessPermitsPage;
