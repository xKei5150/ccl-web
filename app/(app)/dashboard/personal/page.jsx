"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash, SquareUser } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const mockData = [
  {
    id: 1,
    photo: "https://via.placeholder.com/50",
    fullName: "Juan Dela Cruz Santos",
    birthdate: "1990-05-15",
    sex: "Male",
    contactNo: "+63 912 345 6789",
    emailAddress: "juan.santos@email.com",
  },
  {
    id: 2,
    photo: "https://via.placeholder.com/50",
    fullName: "Maria Clara Ramos",
    birthdate: "1995-08-22",
    sex: "Female",
    contactNo: "+63 917 123 4567",
    emailAddress: "maria.ramos@email.com",
  },
];

const columns = [
  {
    header: "Photo",
    accessorKey: "photo",
    cell: ({ row }) => (
      <img
        src={row.original.photo}
        alt={`Photo of ${row.original.fullName}`}
        className="w-10 h-10 rounded-full object-cover"
      />
    ),
  },
  {
    header: "Full Name",
    accessorKey: "fullName",
  },
  {
    header: "Birthdate",
    accessorKey: "birthdate",
  },
  {
    header: "Sex",
    accessorKey: "sex",
  },
  {
    header: "Contact No",
    accessorKey: "contactNo",
  },
  {
    header: "Email Address",
    accessorKey: "emailAddress",
  },
];

const PersonalRecords = () => {
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
      onClick: (row) => router.push(`/dashboard/personal/${row.id}/edit`),
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
          title="Personal Records"
          subtitle="View and manage personal records"
          icon={<SquareUser className="h-8 w-8" />}
        />
        <Button
          onClick={() => router.push("/dashboard/personal/new")}
          className="mb-8"
        >
          <Plus className="mr-2 h-4 w-4" /> New Record
        </Button>
      </div>
        <DataTable
          data={mockData}
          columns={columns}
          pageSize={10}
          actions={actions}
          enableMultiSelect
          onSelectionChange={handleDelete}
          baseUrl="/dashboard/personal"
        />
    </>
  );
};

export default PersonalRecords;
