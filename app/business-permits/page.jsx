"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";


const BusinessPermits = () => {
  const navigate = useRouter();
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
      onClick: (row) => console.log("Edit", row),
    },
    {
      label: "Delete",
      icon: <Trash className="h-4 w-4" />,
      onClick: (row) => handleDelete([row]),
    },
  ];

  const mockData = [
    {
      id: "1",
      businessName: "Tech Solutions Inc",
      address: "123 Main St, City",
      registrationDate: "2024-01-15",
      owner: "John Smith",
      businessEmail: "contact@techsolutions.com",
      status: "Pending Payment"
    },
    {
      id: "2",
      businessName: "Green Gardens Co",
      address: "456 Park Ave, Town",
      registrationDate: "2024-02-01",
      owner: "Jane Doe",
      businessEmail: "info@greengardens.com",
      status: "Approved"
    },
    {
      id: "3",
      businessName: "Digital Services LLC",
      address: "789 Oak Rd, Village",
      registrationDate: "2024-02-15",
      owner: "Mike Johnson",
      businessEmail: "support@digitalservices.com",
      status: "Pending Signature"
    },
  ];

  const columns = [
    {
      header: "Business Name",
      accessorKey: "businessName",
    },
    {
      header: "Address",
      accessorKey: "address",
    },
    {
      header: "Registration Date",
      accessorKey: "registrationDate",
    },
    {
      header: "Owner",
      accessorKey: "owner",
    },
    {
      header: "Status",
      accessorKey: "status",
    },
  ];
  return (
    <>
        <div className="flex justify-between items-center">
          <PageHeader
            title="Business Permits"
            breadcrumbs={[
              {
                label: "Business Permits",
              },
            ]}
          />
          <Button
            onClick={() => navigate.push("/business-permits/new")}
            className="mb-8"
          >
            <Plus className="mr-2 h-4 w-4" /> New Permit
          </Button>
        </div>
        <div className="mt-8">
          <DataTable
            data={mockData}
            columns={columns}
            pageSize={10}
            actions={actions}
            enableMultiSelect
            onSelectionChange={handleDelete}
            baseUrl="/business-permits"
          />
        </div>
        </>
  );
};

export default BusinessPermits;