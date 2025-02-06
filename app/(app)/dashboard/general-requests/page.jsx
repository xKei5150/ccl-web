"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash, ScrollText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";


const columns = [
  {
    header: "Name",
    cell: (row) => {
      const { firstName, middleName, lastName } = row.personalData;
      return (
        <div className="font-medium">
          {firstName}
          {middleName && ` ${middleName.charAt(0)}.`} 
          {` ${lastName}`}
        </div>
      );
    },
  },
  {
    header: "Type",
    accessorKey: "type",
    cell: (row) => {
      const typeMap = {
        indigencyCertificate: "Indigency Certificate",
        barangayClearance: "Barangay Clearance",
        barangayResidency: "Barangay Residency",
      };
      return typeMap[row.type] || row.type;
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (row) => (
      <div className={`capitalize ${
        row.status === "pending" ? "text-yellow-600" :
        row.status === "approved" ? "text-green-600" :
        row.status === "rejected" ? "text-red-600" : ""
      }`}>
        {row.status}
      </div>
    ),
  },
  {
    header: "Date",
    accessorKey: "createdAt",
    cell: (row) => new Date(row.createdAt).toLocaleDateString(),
  },
];

const GeneralRequests = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [requests, setRequests] = useState([]);
  useEffect( () => {
    const loadRequests = async () => {
      const response = await fetch('/api/requests');
      const data = await response.json();
      setRequests(data.docs);
    };
    loadRequests();
  }, []);

  const handleDelete = (rows) => {
    toast({
      title: "Deleting records",
      description: `Deleting ${rows.length} record(s)`,
      variant: "destructive",
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
          data={requests}
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