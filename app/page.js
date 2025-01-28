"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import DashboardCharts from "@/components/dashboard/DashboardCharts";

export default function Dashboard() {
  return (
    <>
      <PageHeader
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
