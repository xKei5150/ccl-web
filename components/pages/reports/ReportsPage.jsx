"use client";

import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteReport, updateReportStatus } from "@/app/(app)/dashboard/reports/actions";
import DataPageLayout from "@/components/layout/DataPageLayout";
import { useAuth } from "@/hooks/use-auth";

const ReportsPage = ({ data }) => {
  const { isAdmin, isStaff } = useAuth();
  const hasAdminAccess = isAdmin || isStaff;
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
            row.reportStatus === "requiresPresence" ? "bg-orange-100 text-orange-800" :
            row.reportStatus === "closed" ? "bg-green-100 text-green-800" :
            "bg-gray-100 text-gray-800"
          )}
        >
          {row.reportStatus === "inProgress" ? "In Progress" : 
           row.reportStatus === "requiresPresence" ? "Requires Presence" : 
           row.reportStatus}
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

  const defaultActions = [
    {
      label: "Edit",
      icon: null,
      showCondition: () => hasAdminAccess,
    },
    {
      label: "Delete",
      icon: null,
      showCondition: () => hasAdminAccess,
    },
  ];

  const statusConfig = {
    field: "reportStatus",
    options: [
      { label: "Open", value: "open" },
      { label: "In Progress", value: "inProgress" },
      { label: "Requires Presence at Barangay", value: "requiresPresence" },
      { label: "Closed", value: "closed" },
    ],
    updateAction: updateReportStatus,
    showCondition: () => hasAdminAccess, // Only admin/staff can change status
  };

  return (
    <DataPageLayout
      title="Reports"
      subtitle="View and manage incident reports"
      icon={FileText}
      columns={columns}
      data={data}
      baseUrl="/dashboard/reports"
      newItemUrl={hasAdminAccess ? "/dashboard/reports/new" : null}
      deleteAction={deleteReport}
      newButtonLabel="New Report"
      defaultActions={defaultActions}
      hideDeleteButton={!hasAdminAccess}
      hideCreateButton={!hasAdminAccess}
      statusConfig={statusConfig}
    />
  );
};

export default ReportsPage;