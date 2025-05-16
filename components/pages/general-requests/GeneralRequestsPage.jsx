"use client";

import { Tickets, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteRequest } from "@/app/(app)/dashboard/general-requests/actions";
import DataPageLayout from "@/components/layout/DataPageLayout";

const GeneralRequestsPage = ({ data }) => {
  const requestTypeMap = {
    indigencyCertificate: "Indigency Certificate",
    barangayClearance: "Barangay Clearance",
    barangayResidency: "Barangay Residency",
  };

  const columns = [
    {
      accessorKey: "person.name.fullName",
      header: "Name",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: (row) => requestTypeMap[row.type] || row.type,
    },
    {
      accessorKey: "purpose",
      header: "Purpose",
      cell: (row) => {
        const purpose = row.purpose;
        return purpose?.length > 50 ? `${purpose.slice(0, 50)}...` : purpose;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (row) => (
        <span
          className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize",
            row.status === "pending" ? "bg-yellow-100 text-yellow-800" :
            row.status === "processing" ? "bg-blue-100 text-blue-800" :
            row.status === "approved" ? "bg-green-100 text-green-800" :
            row.status === "rejected" ? "bg-red-100 text-red-800" :
            row.status === "completed" ? "bg-purple-100 text-purple-800" :
            "bg-gray-100 text-gray-800"
          )}
        >
          {row.status}
        </span>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date Submitted",
      cell: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  const statusFilterOptions = [
    { label: "Pending", value: "pending" },
    { label: "Processing", value: "processing" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    { label: "Completed", value: "completed" },
  ];

  const customFilters = [
    {
      id: "status",
      title: "Status",
      options: statusFilterOptions,
      isMulti: true,
    },
  ];

  const customActions = [
    {
      icon: <Printer className="h-4 w-4" />,
      label: "View Certificate",
      onClick: (row) => {
        window.location.href = `/certificate/${row.id}`;
      },
      showCondition: (row) => row.status === "approved" || row.status === "completed",
    },
  ];

  return (
    <DataPageLayout
      title="General Requests"
      subtitle="View and manage general requests"
      icon={Tickets}
      columns={columns}
      data={data}
      baseUrl="/dashboard/general-requests"
      newItemUrl="/dashboard/general-requests/new"
      deleteAction={deleteRequest}
      newButtonLabel="New Request"
      customFilters={customFilters}
      customActions={customActions}
    />
  );
};

export default GeneralRequestsPage;
