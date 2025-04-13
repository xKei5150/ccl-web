"use client";

import { SquareUser } from "lucide-react";
import { cn } from "@/lib/style-utils";
import { useToast } from '@/hooks/use-toast';
import { useSubmitData } from '@/lib/client-data';
import DataPageLayout from "@/components/layout/DataPageLayout";

const columns = [
  {
    accessorKey: "name.fullName",
    header: "Full Name",
  },
  {
    accessorKey: "demographics.birthDate",
    header: "Birth Date",
    cell: (row) => {
      const value = row.demographics?.birthDate;
      return value ? new Date(value).toLocaleDateString() : 'N/A';
    }
  },
  {
    accessorKey: "demographics.sex",
    header: "Sex",
    cell: (row) => (
      <span className="capitalize">
        {row.demographics?.sex || 'N/A'}
      </span>
    ),
  },
  {
    accessorKey: "contact.emailAddress",
    header: "Email",
    cell: (row) => row.contact?.emailAddress || 'N/A',
  },
  {
    accessorKey: "demographics.maritalStatus",
    header: "Marital Status",
    cell: (row) => (
      <span className="capitalize">
        {row.demographics?.maritalStatus || 'N/A'}
      </span>
    ),
  },
  {
    accessorKey: "status.residencyStatus",
    header: "Residency",
    cell: (row) => {
      const value = row.status?.residencyStatus;
      return (
        <span
          className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize",
            value === "own-outright" ? "bg-green-100 text-green-800" :
            value === "own-mortgage" ? "bg-blue-100 text-blue-800" :
            value === "renting" ? "bg-yellow-100 text-yellow-800" :
            "bg-gray-100 text-gray-800"
          )}
        >
          {value?.replace("-", " ") || 'N/A'}
        </span>
      );
    }
  },
  {
    accessorKey: "status.lifeStatus",
    header: "Life Status",
    cell: (row) => {
      const value = row.status?.lifeStatus;
      return (
        <span
          className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize",
            value === "alive" ? "bg-green-100 text-green-800" :
            value === "deceased" ? "bg-red-100 text-red-800" :
            "bg-gray-100 text-gray-800"
          )}
        >
          {value || 'N/A'}
        </span>
      );
    }
  },
];

export default function PersonalPage({ data }) {
  const { toast } = useToast();
  
  // Use React Query for delete mutation
  const { mutate: deleteRecords, isLoading: isDeleting } = useSubmitData(
    '/api/personal/delete',
    {
      method: 'DELETE',
      successMessage: 'Record(s) deleted successfully',
      invalidateQueries: ['personal-records'],
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete record(s)',
          variant: 'destructive',
        });
      }
    }
  );
  
  // Handle delete action
  const handleDelete = (ids) => {
    if (!ids || (Array.isArray(ids) && !ids.length)) return;
    
    deleteRecords({ ids: Array.isArray(ids) ? ids : [ids] });
  };

  return (
    <DataPageLayout
      title="Personal Information"
      subtitle="View and manage personal records"
      icon={SquareUser}
      columns={columns}
      data={data}
      baseUrl="/dashboard/personal"
      newItemUrl="/dashboard/personal/new"
      deleteAction={handleDelete}
      newButtonLabel="New Record"
      isDeleting={isDeleting}
    />
  );
}