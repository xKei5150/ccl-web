"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash, ScrollText } from "lucide-react";
import { useRouter } from "next/navigation";
// Mock data for demonstration
const mockRequests = [
  {
    id: 1,
    requestType: "Certificate of Residency",
    fullName: "Juan Dela Cruz",
    status: "Pending",
  },
  {
    id: 2,
    requestType: "Barangay Clearance",
    fullName: "Maria Santos",
    status: "Approved",
  },
  {
    id: 3,
    requestType: "Business Permit",
    fullName: "Pedro Reyes",
    status: "Rejected",
  },
];

const columns = [
  {
    header: "Request Type",
    accessorKey: "requestType",
  },
  {
    header: "Full Name",
    accessorKey: "fullName",
  },
  {
    header: "Status",
    accessorKey: "status",
  },
];

const GeneralRequests = () => {
  const router = useRouter();

  const handleDelete = (rows) => {
    toast({
      title: "Deleting records",
      description: `Deleting ${rows.length} record(s)`,
    });
    // Implement actual delete logic here
  };

  const actions = [
    {
      label: "Edit",
      icon: <Edit2 className="h-4 w-4" />,
      onClick: (row) => router.push(`/dashboard/general-requests/${row.id}/edit`),
    },
    {
      label: "Delete",
      icon: <Trash className="h-4 w-4" />,
      onClick: (row) => handleDelete([row]),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center">
        <PageHeader
          title="General Requests"
          subtitle="View and manage general requests"
          icon={<ScrollText className="h-8 w-8" />}
        />
        <Button
          onClick={() => router.push("/dashboard/general-requests/new")}
          className="mb-8"
        >
          <Plus className="mr-2 h-4 w-4" /> New Request
        </Button>
      </div>
        <DataTable
          data={mockRequests}
          columns={columns}
          pageSize={10}
          actions={actions}
          enableMultiSelect
          onSelectionChange={handleDelete}
          baseUrl="/dashboard/general-requests"
        />
    </>
  );
};

export default GeneralRequests;