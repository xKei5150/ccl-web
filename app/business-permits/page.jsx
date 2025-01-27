"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";

const mockData = [
  {
    businessName: "ABC Corporation",
    address: "123 Main St, City",
    registrationDate: "2024-01-15",
    owner: "John Smith",
    status: "Active",
  },
  {
    businessName: "XYZ Enterprises",
    address: "456 Oak Ave, Town",
    registrationDate: "2024-02-01",
    owner: "Jane Doe",
    status: "Pending",
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

const BusinessPermits = () => {
  const navigate = useRouter();

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
          />
        </div>
        </>
  );
};

export default BusinessPermits;