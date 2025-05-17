// @/components/pages/business/BusinessPermitsPage.jsx
"use client";

import { Tickets, Printer, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteBusinessPermit } from "@/app/(app)/dashboard/business-permits/actions";
import DataPageLayout from "@/components/layout/DataPageLayout";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const BusinessPermitsPage = ({ data }) => {
  const router = useRouter();
  const { isAdmin, isStaff } = useAuth();
  const hasAdminAccess = isAdmin || isStaff;

  const columns = [
    {
      accessorKey: "business.businessName",
      header: "Business Name",
      cell: (row) => {
        const businessId = row.business?.id;
        return businessId ? (
          <Button 
            variant="link" 
            className="p-0 h-auto text-left font-normal hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/dashboard/business/${businessId}`);
            }}
          >
            <span className="mr-1">{row.business.businessName}</span>
            <ExternalLink className="h-3 w-3 inline" />
          </Button>
        ) : (
          row.business?.businessName || "-"
        );
      },
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
    {
      accessorKey: "status",
      header: "Status",
      cell: (row) => (
        <span
          className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize",
            row.status === "pending" ? "bg-yellow-100 text-yellow-800" :
            row.status === "approved" ? "bg-green-100 text-green-800" :
            row.status === "rejected" ? "bg-red-100 text-red-800" :
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
  ];

  const statusFilterOptions = [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
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
      label: "View Certificate",
      icon: <Printer className="h-4 w-4" />,
      onClick: (row) => router.push(`/certificate/${row.id}?type=business`),
      showCondition: (row) => row.status === "approved" && hasAdminAccess,
    },
  ];

  const defaultActions = [
    {
      label: "Edit",
      icon: null,
      showCondition: (row) => row.status !== "approved" || hasAdminAccess,
    },
    {
      label: "Delete",
      icon: null,
      showCondition: () => hasAdminAccess,
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
      newButtonLabel="New Business Permit"
      customActions={customActions}
      defaultActions={defaultActions}
      customFilters={customFilters}
      hideDeleteButton={!hasAdminAccess}
    />
  );
};

export default BusinessPermitsPage;
