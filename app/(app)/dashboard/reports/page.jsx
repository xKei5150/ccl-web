//app/(app)/dashboard/reports/page.jsx

"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";


const columns = [
  {
    header: "Title",
    accessorKey: "title",
  },
  {
    header: "Date",
    accessorKey: "date",
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
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const loadReports = async () => {
      let reports = await fetch("/api/reports");
      reports = await reports.json();
      setReports(reports.docs);
    }
    loadReports();
  }, []);

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
      onClick: (row) => router.push(`/dashboard/reports/${row.id}/edit`),
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
          subtitle="View and manage reports"
          icon={<FileText className="h-8 w-8" />}
        />
        <Button onClick={() => router.push("/dashboard/reports/new")} className="mb-8">
          <Plus className="mr-2 h-4 w-4" /> New Report
        </Button>
      </div>
      {/* <DataTable
            data={mockData}
            columns={columns2}
            pageSize={10}
            baseUrl="/dashboard/reports"
            actions={actions}
            enableMultiSelect
            onSelectionChange={handleDelete}
          /> */}
      <DataTable
        data={reports}
        columns={columns}
        pageSize={10}
        baseUrl="/dashboard/reports"
        actions={actions}
        enableMultiSelect
        onSelectionChange={handleDelete}
      />
    </>
  );
};

export default Reports;
