"use client";

import { Home } from "lucide-react";
import { deleteHousehold } from "@/app/(app)/dashboard/household/actions";
import DataPageLayout from "@/components/layout/DataPageLayout";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function HouseholdPage({ data }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    {
      header: "Family Name",
      accessorKey: "familyName",
    },
    {
      header: "Local Address",
      accessorKey: "localAddress",
    },
    {
      header: "Members",
      accessorKey: "members",
      cell: (row) => row.members?.length || 0,
    },
    {
      header: "Residency Date",
      accessorKey: "residencyDate",
      cell: (row) => {
        const date = row.residencyDate;
        return date ? format(new Date(date), 'PP') : 'Not specified';
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => (
        <span className={cn(
          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
          getStatusStyle(row.status)
        )}>
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <DataPageLayout
      title="Households"
      subtitle="View and manage household records"
      icon={Home}
      columns={columns}
      data={data}
      baseUrl="/dashboard/household"
      newItemUrl="/dashboard/household/new"
      deleteAction={deleteHousehold}
      newButtonLabel="New Record"
    />
  );
}
