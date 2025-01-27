"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const mockData = [
  {
    id: 1,
    familyName: "Santos Family",
    localAddress: "123 Rizal St, Brgy. Sample",
    residencyDate: "2010-03-15",
  },
  {
    id: 2,
    familyName: "Ramos Family",
    localAddress: "456 Bonifacio Ave, Brgy. Sample",
    residencyDate: "2015-07-22",
  },
];

const columns = [
  {
    header: "Family Name",
    accessorKey: "familyName",
  },
  {
    header: "Local Address",
    accessorKey: "localAddress",
  },
  {
    header: "Residency Date",
    accessorKey: "residencyDate",
  },
];

const HouseholdRecords = () => {
  const router = useRouter();
  const { toast } = useToast();

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
      onClick: (row) => router.push(`/household/${row.id}/edit`),
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
            title="Household Records"
            breadcrumbs={[
              {
                label: "Household Information",
              },
            ]}
          />
          <Button
            onClick={() => router.push("/household/new")}
            className="mb-8"
          >
            <Plus className="mr-2 h-4 w-4" /> New Household
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
            baseUrl="/household"
          />
        </div>
        </>
  );
};

export default HouseholdRecords;