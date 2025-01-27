"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { useToast } from "@/components/ui/use-toast";

const mockData = [
  {
    id: 1,
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    location: "North District",
    description: "Monthly community safety report...",
  },
  {
    id: 2,
    startDate: "2024-02-01",
    endDate: "2024-02-29",
    location: "South District",
    description: "Infrastructure maintenance summary...",
  },
];

const columns = [
  {
    header: "Start Date",
    accessorKey: "startDate",
  },
  {
    header: "End Date",
    accessorKey: "endDate",
  },
  {
    header: "Location",
    accessorKey: "location",
  },
  {
    header: "Description",
    accessorKey: "description",
  },
];

const Reports = () => {
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = (rows) => {
    toast({
      title: "Deleting reports",
      description: `Deleting ${rows.length} report(s)`,
    });
    // Implement actual delete logic here
  };

  const actions = [
    {
      label: "Edit",
      icon: <Edit2 className="h-4 w-4" />,
      onClick: (row) => router.push(`/reports/${row.id}/edit`),
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
            title="Reports"
            breadcrumbs={[
              {
                label: "Reports",
              },
            ]}
          />
          <Button onClick={() => router.push("/reports/new")} className="mb-8">
            <Plus className="mr-2 h-4 w-4" /> New Report
          </Button>
        </div>
        <div className="mt-8">
          <DataTable
            data={mockData}
            columns={columns}
            pageSize={10}
            baseUrl="/reports"
            actions={actions}
            enableMultiSelect
            onSelectionChange={handleDelete}
          />
        </div>
        </>
  );
};

export default Reports;
