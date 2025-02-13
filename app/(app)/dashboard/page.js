import { Suspense } from "react";
import { DashboardCharts } from "@/components/pages/dashboard/DashboardCharts";
import { DashboardSkeleton } from "@/components/pages/dashboard/DashboardSkeleton";
import { DashboardError } from "@/components/pages/dashboard/DashboardError";
import { ErrorBoundary } from "@/components/pages/dashboard/ErrorBoundary";
import { getDashboardData, getAvailableYears } from "@/lib/actions/dashboard-actions";

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

async function DashboardContent() {
  const year = new Date().getFullYear();
  const { data, availableYears, error } = await getDashboardData(2024);
  
  if (error) {
    return <DashboardError error={new Error(error)} />;
  }
  
  if (!data?.length) {
    return <DashboardError error={new Error("No data available")} />;
  }

  return (
    <ErrorBoundary>
      <DashboardCharts 
        initialData={data} 
        availableYears={await availableYears || [year]} 
      />
    </ErrorBoundary>
  );
}

export default function DashboardPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </main>
  );
}
