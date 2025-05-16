"use client";

import { UsersRound, Calendar, Users, Mars, Venus, HomeIcon, VoteIcon, Accessibility, PieChart, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteDemographic } from "@/app/(app)/dashboard/demographics/actions";
import DataPageLayout from "@/components/layout/DataPageLayout";

const DemographicsListPage = ({ data }) => {
  const columns = [
    {
      accessorKey: "year",
      header: "Year",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{row.year}</span>
        </div>
      ),
    },
    {
      accessorKey: "totalPopulation",
      header: "Total Population",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{row.totalPopulation}</span>
        </div>
      ),
    },
    {
      accessorKey: "maleCount",
      header: "Male",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <Mars className="h-4 w-4 text-muted-foreground" />
          <span>{row.maleCount}</span>
        </div>
      ),
    },
    {
      accessorKey: "femaleCount",
      header: "Female",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <Venus className="h-4 w-4 text-muted-foreground" />
          <span>{row.femaleCount}</span>
        </div>
      ),
    },
    {
      accessorKey: "householdsCount",
      header: "Households",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <HomeIcon className="h-4 w-4 text-muted-foreground" />
          <span>{row.householdsCount || "N/A"}</span>
        </div>
      ),
    },
    {
      accessorKey: "voterCount",
      header: "Voters",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <VoteIcon className="h-4 w-4 text-muted-foreground" />
          <span>{row.voterCount || "N/A"}</span>
        </div>
      ),
    },
    {
      accessorKey: "pwdCount",
      header: "PWD Count",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <Accessibility className="h-4 w-4 text-muted-foreground" />
          <span>{row.pwdCount || "N/A"}</span>
        </div>
      ),
    },
    {
      accessorKey: "ageGroups",
      header: "Age Groups",
      cell: (row) => {
        const groups = row.ageGroups || [];
        return (
          <div className="flex items-center gap-1.5">
            <PieChart className="h-4 w-4 text-muted-foreground" />
            <span>
              {groups.length > 0 
                ? `${groups.length} ${groups.length === 1 ? 'group' : 'groups'}`
                : 'None'}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "chronicDiseases",
      header: "Diseases",
      cell: (row) => {
        const diseases = row.chronicDiseases || [];
        return (
          <div className="flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span>
              {diseases.length > 0 
                ? `${diseases.length} ${diseases.length === 1 ? 'disease' : 'diseases'}`
                : 'None'}
            </span>
          </div>
        );
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