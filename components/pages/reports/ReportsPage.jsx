"use client";

import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteReport } from "@/app/(app)/dashboard/reports/actions";
import DataPageLayout from "@/components/layout/DataPageLayout";

const ReportsPage = ({ data }) => {
  const columns = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: (row) => new Date(row.date).toLocaleDateString(),
      enableSorting: true,
    },
    {
      accessorKey: "location",
      header: "Location",
      enableSorting: true,
    },
    {
      accessorKey: "reportStatus",
      header: "Status",
      cell: (row) => (
        <span
          className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize",
            row.reportStatus === "open" ? "bg-blue-100 text-blue-800" :
            row.reportStatus === "inProgress" ? "bg-yellow-100 text-yellow-800" :
            row.reportStatus === "closed" ? "bg-green-100 text-green-800" :
            "bg-gray-100 text-gray-800"
          )}
        >
          {row.reportStatus === "inProgress" ? "In Progress" : row.reportStatus}
        </span>
      ),
    },
    {
      accessorKey: "involvedPersons",
      header: "Involved Party",
      cell: (row) => {
        const persons = row.involvedPersons || [];
        return persons.length > 0 
          ? `${persons.length} ${persons.length === 1 ? 'person' : 'people'}`
          : 'None';
      },
    },
  ];

  return (
    <DataPageLayout
      title="Reports"
      subtitle="View and manage incident reports"
      icon={FileText}
      columns={columns}
      data={data}
      baseUrl="/dashboard/reports"
      newItemUrl="/dashboard/reports/new"
      deleteAction={deleteReport}
      newButtonLabel="New Report"
    />
  );
};

export default ReportsPage;