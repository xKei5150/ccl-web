"use client";

import { Calculator, Clock, FileCheck, FileWarning, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteFinancingRecord } from "@/app/(app)/dashboard/financing/actions";
import DataPageLayout from "@/components/layout/DataPageLayout";
import { Badge } from "@/components/ui/badge";
import { formatGovCurrency, APPROVAL_STATES } from "@/lib/finance-utils";

// Approval state badge variants
const approvalStateVariants = {
  [APPROVAL_STATES.DRAFT]: { variant: "outline", icon: <Clock className="h-3 w-3 mr-1" />, label: "Draft" },
  [APPROVAL_STATES.SUBMITTED]: { variant: "secondary", icon: <FileCheck className="h-3 w-3 mr-1" />, label: "Submitted" },
  [APPROVAL_STATES.UNDER_REVIEW]: { variant: "secondary", icon: <FileWarning className="h-3 w-3 mr-1" />, label: "Under Review" },
  [APPROVAL_STATES.APPROVED]: { variant: "success", icon: <CheckCircle2 className="h-3 w-3 mr-1" />, label: "Approved" },
  [APPROVAL_STATES.REJECTED]: { variant: "destructive", icon: <AlertTriangle className="h-3 w-3 mr-1" />, label: "Rejected" }
};

export default function FinancingPage({ data }) {
  const columns = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ( row ) => (
        <div className="font-medium">{row.title}</div>
      ),
    },
    {
      accessorKey: "approvalState",
      header: "Status",
      cell: ( row ) => {
        const state = row.approvalState || APPROVAL_STATES.DRAFT;
        const stateConfig = approvalStateVariants[state] || approvalStateVariants[APPROVAL_STATES.DRAFT];
        return (
          <Badge variant={stateConfig.variant} className="capitalize">
            {stateConfig.icon}
            {stateConfig.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "accountType",
      header: "Account Type",
      cell: ( row ) => (
        <span className="capitalize">
          {row.accountType?.replace(/_/g, ' ') || 'N/A'}
        </span>
      ),
    },
    {
      accessorKey: "fiscalYear",
      header: "Fiscal Year",
      cell: ( row ) => row.fiscalYear || 'N/A',
    },
    {
      accessorKey: "budgetedAmount",
      header: "Budgeted",
      cell: ( row ) => formatGovCurrency(row.budgetedAmount || 0),
    },
    {
      accessorKey: "createdBy",
      header: "Created By",
      cell: ( row ) => row.createdBy?.email || 'System',
    },
    {
      accessorKey: "createdAt",
      header: "Created Date",
      cell: ( row ) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A',
    },
  ];
  return (
    <DataPageLayout
      title="Financing Records"
      subtitle="View and manage government financing records"
      icon={Calculator}
      columns={columns}
      data={data}
      baseUrl="/dashboard/financing"
      newItemUrl="/dashboard/financing/new"
      deleteAction={deleteFinancingRecord}
      newButtonLabel="New Financing Record"
    />
  );
}