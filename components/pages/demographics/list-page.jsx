"use client";

import { UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteDemographic } from "@/app/(app)/dashboard/demographics/actions";
import DataPageLayout from "@/components/layout/DataPageLayout";

const DemographicsListPage = ({ data }) => {
  const columns = [
    {
      accessorKey: "year",
      header: "Year",
    },
    {
      accessorKey: "totalPopulation",
      header: "Total Population",
    },
    {
      accessorKey: "maleCount",
      header: "Male",
    },
    {
      accessorKey: "femaleCount",
      header: "Female",
    },
    {
      accessorKey: "householdsCount",
      header: "Households",
      cell: (row) => row.householdsCount || "N/A",
    },
    {
      accessorKey: "voterCount",
      header: "Voters",
      cell: (row) => row.voterCount || "N/A",
    },
    {
      accessorKey: "pwdCount",
      header: "PWD Count",
      cell: (row) => row.pwdCount || "N/A",
    },
    {
      accessorKey: "ageGroups",
      header: "Age Groups",
      cell: (row) => {
        const groups = row.ageGroups || [];
        return groups.length > 0 
          ? `${groups.length} ${groups.length === 1 ? 'group' : 'groups'}`
          : 'None';
      },
    },
    {
      accessorKey: "chronicDiseases",
      header: "Diseases",
      cell: (row) => {
        const diseases = row.chronicDiseases || [];
        return diseases.length > 0 
          ? `${diseases.length} ${diseases.length === 1 ? 'disease' : 'diseases'}`
          : 'None';
      },
    },
  ];

  return (
    <DataPageLayout
      title="Demographics"
      subtitle="View and manage barangay demographic data"
      icon={UsersRound}
      columns={columns}
      data={data}
      baseUrl="/dashboard/demographics"
      newItemUrl="/dashboard/demographics/new"
      deleteAction={deleteDemographic}
      newButtonLabel="New Demographic Record"
    />
  );
};

export default DemographicsListPage; 