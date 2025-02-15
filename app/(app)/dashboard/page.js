import { Suspense } from 'react';
import { DashboardCharts } from '@/components/pages/dashboard/DashboardCharts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getDashboardData } from '@/lib/actions/dashboard-actions';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

async function DashboardContent({ searchParams }) {
  const year = parseInt(searchParams?.year) || new Date().getFullYear();
  const { data, availableYears, error } = await getDashboardData(year);
  
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
    />
  );
}

export default function DashboardPage({ searchParams }) {
  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense 
        fallback={
          <Card>
            <CardContent className="py-24">
              <div className="flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
              </div>
            </CardContent>
          </Card>
        }
      >
        <DashboardContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
