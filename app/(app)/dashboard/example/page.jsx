import { fetchCollection } from '@/lib/data-fetching';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Grid } from '@/components/layout/grid';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ClientDataTable } from './client-data-table';

export const metadata = {
  title: 'Example Page | CCL',
  description: 'Example server component with data fetching',
};

/**
 * Example server component page demonstrating the new data fetching pattern
 */
export default async function ExamplePage() {
  // Fetch data from server
  const businesses = await fetchCollection('business', { 
    limit: 5,
    sort: '-createdAt',
    depth: 2,
  });
  
  const personalRecords = await fetchCollection('personal-information', {
    limit: 5,
    sort: '-createdAt',
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Heading
          title="Example Page"
          description="Demonstrates server component data fetching"
        />
        <Button asChild>
          <Link href="/dashboard/example/new">Create New</Link>
        </Button>
      </div>
      
      {/* Stats cards */}
      <Grid mobile={1} tablet={2} desktop={3}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Businesses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businesses.totalDocs}</div>
            <p className="text-muted-foreground">Total business records</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Personal Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{personalRecords.totalDocs}</div>
            <p className="text-muted-foreground">Total personal records</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Server Rendered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              This data was fetched and rendered on the server
            </div>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Client component that receives server data */}
      <Card>
        <CardHeader>
          <CardTitle>Client Data Table</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientDataTable initialData={businesses.docs} />
        </CardContent>
      </Card>
    </div>
  );
} 