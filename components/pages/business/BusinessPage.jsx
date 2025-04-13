// @/components/pages/business/BusinessPage.jsx
"use client";

import { Building2 } from "lucide-react";
import { deleteBusiness } from "@/app/(app)/dashboard/business/data";
import DataPageLayout from "@/components/layout/DataPageLayout";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function BusinessPage({ data }) {
  const router = useRouter();

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
      cell: ({ row }) => {
        const date = row.getValue("registrationDate");
        return date ? new Date(date).toLocaleDateString() : "N/A";
      },
    },
    {
      accessorKey: "businessEmailAddress",
      header: "Business Email",
    },
  ];

  const handleDelete = async (ids) => {
    try {
      await deleteBusiness(ids);
      toast.success("Business deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete business");
      console.error(error);
    }
  };

  return (
    <DataPageLayout
      title="Business Information"
      subtitle="View and manage business information"
      icon={Building2}
      columns={columns}
      data={data}
      baseUrl="/dashboard/business"
      newItemUrl="/dashboard/business/new"
      deleteAction={handleDelete}
      newButtonLabel="New Business"
    />
  );
}
