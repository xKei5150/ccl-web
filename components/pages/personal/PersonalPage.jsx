"use client";

import { SquareUser } from "lucide-react";
import { cn } from "@/lib/utils";
import { deletePersonalRecord } from "@/app/(app)/dashboard/personal/actions";
import DataPageLayout from "@/components/layout/DataPageLayout";

const columns = [
  {
    accessorKey: "name.fullName",
    header: "Full Name",
  },
  {
    accessorKey: "demographics.birthDate",
    header: "Birth Date",
    cell: (row) => row.demographics?.birthDate ? new Date(row.demographics.birthDate).toLocaleDateString() : 'N/A',
  },
  {
    accessorKey: "demographics.sex",
    header: "Sex",
    cell: (row) => (
      <span className="capitalize">
        {row.demographics?.sex || 'N/A'}
      </span>
    ),
  },
  {
    accessorKey: "contact.emailAddress",
    header: "Email",
    cell: (row) => row.contact?.emailAddress || 'N/A',
  },
  {
    accessorKey: "demographics.maritalStatus",
    header: "Marital Status",
    cell: (row) => (
      <span className="capitalize">
        {row.demographics?.maritalStatus || 'N/A'}
      </span>
    ),
  },
  {
    accessorKey: "status.residencyStatus",
    header: "Residency",
    cell: (row) => (
      <span
        className={cn(
          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize",
          row.status?.residencyStatus === "own-outright" ? "bg-green-100 text-green-800" :
          row.status?.residencyStatus === "own-mortgage" ? "bg-blue-100 text-blue-800" :
          row.status?.residencyStatus === "renting" ? "bg-yellow-100 text-yellow-800" :
          "bg-gray-100 text-gray-800"
        )}
      >
        {row.status?.residencyStatus?.replace("-", " ") || 'N/A'}
      </span>
    ),
  },
  {
    accessorKey: "status.lifeStatus",
    header: "Life Status",
    cell: (row) => (
      <span
        className={cn(
          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize",
          row.status?.lifeStatus === "alive" ? "bg-green-100 text-green-800" :
          row.status?.lifeStatus === "deceased" ? "bg-red-100 text-red-800" :
          "bg-gray-100 text-gray-800"
        )}
      >
        {row.status?.lifeStatus || 'N/A'}
      </span>
    ),
  },
];

export default function PersonalPage({ data }) {
  return (
    <DataPageLayout
      title="Personal Information"
      subtitle="View and manage personal records"
      icon={SquareUser}
      columns={columns}
      data={data}
      baseUrl="/dashboard/personal"
      newItemUrl="/dashboard/personal/new"
      deleteAction={deletePersonalRecord}
      newButtonLabel="New Record"
    />
  );
}