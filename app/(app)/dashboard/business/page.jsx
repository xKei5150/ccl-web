"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/layout/PageHeader";
import { Edit2, Trash, Plus, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

const BusinessInformation = () => {
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
      onClick: (row) => router.push(`/dashboard/business/${row.id}/edit`),
    },
    {
      label: "Delete",
      icon: <Trash className="h-4 w-4" />,
      onClick: (row) => handleDelete([row]),
    },
  ];

  const businessData = [
    {
      id: "1",
      businessName: "Tech Solutions Inc",
      address: "123 Main St, City",
      registrationDate: "2024-01-15",
      owner: "John Smith",
      businessEmail: "contact@techsolutions.com",
    },
    {
      id: "2",
      businessName: "Green Gardens Co",
      address: "456 Park Ave, Town",
      registrationDate: "2024-02-01",
      owner: "Jane Doe",
      businessEmail: "info@greengardens.com",
    },
    {
      id: "3",
      businessName: "Digital Services LLC",
      address: "789 Oak Rd, Village",
      registrationDate: "2024-02-15",
      owner: "Mike Johnson",
      businessEmail: "support@digitalservices.com",
    },
  ];

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
    },
    {
      accessorKey: "owner",
      header: "Owner",
    },
    {
      accessorKey: "businessEmail",
      header: "Business Email",
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center">
        <PageHeader
          title="Business Information"
          subtitle="View and manage business information"
          icon={<Building2 />}
        />
        <Button
          onClick={() => router.push("/dashboard/business/new")}
          className="mb-8"
        >
          <Plus className="mr-2 h-4 w-4" /> New Business
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={businessData}
        pageSize={10}
        actions={actions}
        enableMultiSelect
        onSelectionChange={handleDelete}
        baseUrl="/dashboard/business"
      />
    </>
  );
};

export default BusinessInformation;
