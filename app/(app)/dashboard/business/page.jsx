// app/(app)/dashboard/business/page.jsx
import { Suspense } from 'react';
import { BusinessList } from '@/components/business/BusinessList';
import { BusinessFilters } from '@/components/business/BusinessFilters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { SearchSkeleton } from '@/components/shared/SearchSkeleton';
import { TableSkeleton } from '@/components/shared/TableSkeleton';

export const metadata = {
  title: 'Business Management',
  description: 'Manage your business accounts and information.',
};

export default async function BusinessPage({ searchParams }) {
  const params = await searchParams;
  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Management"
        description="View and manage your business accounts"
        actions={
          <Button asChild>
            <Link href="/dashboard/business/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Business
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Businesses</CardTitle>
          <CardDescription>
            Manage your business accounts and track their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<SearchSkeleton />}>
            <BusinessFilters />
          </Suspense>
          
          <div className="mt-6">
            <Suspense fallback={<TableSkeleton columns={6} rows={5} />}>
              <BusinessList searchParams={params} />
            </Suspense>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}