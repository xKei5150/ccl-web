"use client";

import { Tickets, Printer, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteRequest } from "@/app/(app)/dashboard/general-requests/actions";
import DataPageLayout from "@/components/layout/DataPageLayout";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const GeneralRequestsPage = ({ data }) => {
  const router = useRouter();
  const { isAdmin, isStaff } = useAuth();
  const hasAdminAccess = isAdmin || isStaff;
  
  const requestTypeMap = {
    indigencyCertificate: "Indigency Certificate",
    barangayClearance: "Barangay Clearance",
    barangayResidency: "Barangay Residency",
  };

  const columns = [
    {
      accessorKey: "person.name.fullName",
      header: "Name",
      cell: (row) => {
        const personId = row.person?.id;
        const fullName = row.person?.name?.fullName || "Unknown";
        
        // Only make the name clickable for admin or staff
        if (hasAdminAccess && personId) {
          return (
            <Button 
              variant="link" 
              className="p-0 h-auto text-left font-normal hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/dashboard/personal/${personId}`);
              }}
            >
              <span className="mr-1">{fullName}</span>
              <ExternalLink className="h-3 w-3 inline" />
            </Button>
          );
        }
        
        return fullName;
      },
      enableSorting: true,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: (row) => requestTypeMap[row.type] || row.type,
      enableSorting: true,
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
      enableSorting: true,
    },
    {
      accessorKey: "createdAt",
      header: "Date Submitted",
      cell: (row) => new Date(row.createdAt).toLocaleDateString(),
      enableSorting: true,
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
      showCondition: (row) => 
        (row.status === "approved" || row.status === "completed") && hasAdminAccess,
    },
  ];

  const defaultActions = [
    {
      label: "Edit",
      icon: null,
      showCondition: (row) => !(row.status === "approved" || row.status === "completed") || hasAdminAccess,
    },
    {
      label: "Delete",
      icon: null,
      showCondition: () => hasAdminAccess,
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
      defaultActions={defaultActions}
      hideDeleteButton={!hasAdminAccess}
    />
  );
};

export default GeneralRequestsPage;
