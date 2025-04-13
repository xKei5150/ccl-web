import { Suspense } from 'react';
import { DashboardCharts } from '@/components/pages/dashboard/DashboardCharts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { fetchDashboardData } from './dashboard-data';
import { Loading } from '@/components/ui/loading';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

/**
 * Server component for rendering dashboard content
 */
async function DashboardContent({ searchParams }) {
  const year = parseInt(searchParams?.year) || new Date().getFullYear();
  const { data, availableYears, error } = await fetchDashboardData(year);
  
  if (error) {
    return (
      <Card>
        <CardHeader className="text-destructive">Error Loading Dashboard</CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!data?.length) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">No data available for selected year</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <DashboardCharts 
      initialData={data} 
      availableYears={availableYears} 
      initialYear={year}
    />
  );
}

/**
 * Main dashboard page with proper suspense handling
 */
export default function DashboardPage({ searchParams }) {
  return (
    <div className="space-y-6">
      <Suspense fallback={<DashboardLoading />}>
        <DashboardContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

/**
 * Inline dashboard loading component
 */
function DashboardLoading() {
  return (
    <Card>
      <CardContent className="py-12">
        <Loading variant="spinner" size="lg" text="Loading dashboard data..." />
      </CardContent>
    </Card>
  );
}
