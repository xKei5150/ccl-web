// app/(app)/dashboard/[feature]/page.jsx
import { Suspense } from 'react';
import { fetchFeatureData } from "./data";
import FeatureList from "@/components/feature/FeatureList";
import FeatureFilters from "@/components/feature/FeatureFilters";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { SearchSkeleton } from '@/components/shared/SearchSkeleton';
import { TableSkeleton } from '@/components/shared/TableSkeleton';

export const metadata = {
  title: "Feature Name | CCL",
  description: "View and manage feature data.",
};

/**
 * Content component with data fetching
 */
async function FeatureContent({ searchParams }) {
  const data = await fetchFeatureData(searchParams);
  
  return (
    <FeatureList 
      data={data} 
      searchParams={searchParams} 
    />
  );
}

export default async function FeaturePage({ searchParams }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Feature Name"
        description="View and manage feature data"
        actions={
          <Button asChild>
            <Link href="/dashboard/feature/new">
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Feature Items</CardTitle>
          <CardDescription>
            Manage your feature items and track their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<SearchSkeleton />}>
            <FeatureFilters />
          </Suspense>
          
          <div className="mt-6">
            <Suspense fallback={<TableSkeleton columns={5} rows={5} />}>
              <FeatureContent searchParams={searchParams} />
            </Suspense>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 