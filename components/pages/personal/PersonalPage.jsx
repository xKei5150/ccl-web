"use client";

import { SquareUser, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { deletePersonalRecord } from "@/app/(app)/dashboard/personal/actions";
import DataPageLayout from "@/components/layout/DataPageLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PersonalPage = ({ data }) => {
  const columns = [
    {
      accessorKey: "Photo",
      header: "",
      cell: (row) => {
        const photoUrl = row.photo?.url;
        const fullName = row.name?.fullName || 'Unknown';
        const initials = fullName
          .split(' ')
          .map(name => name[0])
          .join('')
          .toUpperCase()
          .substring(0, 2);
          
        return (
          <Avatar className="h-10 w-10">
            {photoUrl ? (
              <AvatarImage 
                src={photoUrl} 
                alt={fullName} 
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-primary">
              {initials || <User className="h-5 w-5" />}
            </AvatarFallback>
          </Avatar>
        );
      }
    },
    {
      accessorKey: "name.fullName",
      header: "Full Name",
      enableSorting: true,
    },
    {
      accessorKey: "demographics.birthDate",
      header: "Birth Date",
      cell: (row) => row.demographics?.birthDate ? new Date(row.demographics.birthDate).toLocaleDateString() : 'N/A',
      enableSorting: true,
    },
    {
      accessorKey: "demographics.sex",
      header: "Sex",
      cell: (row) => (
        <span className="capitalize">
          {row.demographics?.sex || 'N/A'}
        </span>
      ),
      enableSorting: true,
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
      enableSorting: true,
    },
    {
      accessorKey: "status.residencyStatus",
      header: "Residency",
      cell: (row) => (
        <span
          className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize",
            row.status?.residencyStatus === "own-outright" ? "bg-green-100 text-green-800" :
            row.status?.residencyStatus === "own-mortgage" ? "bg-blue-100 text-blue-800" :
            row.status?.residencyStatus === "renting" ? "bg-yellow-100 text-yellow-800" :
            "bg-gray-100 text-gray-800"
          )}
        >
          {row.status?.residencyStatus?.replace("-", " ") || 'N/A'}
        </span>
      ),
    },
    {
      accessorKey: "status.lifeStatus",
      header: "Life Status",
      cell: (row) => (
        <span
          className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize",
            row.status?.lifeStatus === "alive" ? "bg-green-100 text-green-800" :
            row.status?.lifeStatus === "deceased" ? "bg-red-100 text-red-800" :
            "bg-gray-100 text-gray-800"
          )}
        >
          {row.status?.lifeStatus || 'N/A'}
        </span>
      ),
    },
  ];

  return (
    <DataPageLayout
      title="Personal Information"
      subtitle="View and manage personal records"
      icon={SquareUser}
      columns={columns}
      data={data}
      baseUrl="/dashboard/personal"
      newItemUrl="/dashboard/personal/new"
      deleteAction={deletePersonalRecord}
      newButtonLabel="New Record"
    />
  );
};

export default PersonalPage;