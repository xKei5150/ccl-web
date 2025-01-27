"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import DashboardCharts from "@/components/dashboard/DashboardCharts";

export default function Dashboard() {
  return (
    <>
      <PageHeader
        title="Barangay Management System"
        breadcrumbs={[
          {
            label: "Dashboard",
          },
        ]}
      />
      <div className="mt-8">
        <DashboardCharts />
      </div>
    </>
  );
}
