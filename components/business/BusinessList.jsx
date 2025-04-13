import { getBusinesses } from '@/app/(app)/dashboard/business/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';
import { Pagination } from '../ui/pagination';
import { format } from 'date-fns';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { notFound } from 'next/navigation';

const statusColors = {
  active: 'bg-green-100 text-green-800',
  Active: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  inactive: 'bg-gray-100 text-gray-800',
  Inactive: 'bg-gray-100 text-gray-800',
  'Under Review': 'bg-blue-100 text-blue-800',
};

export async function BusinessList({ searchParams }) {
  const data = await getBusinesses(searchParams);
  
  if (!data) {
    notFound();
  }
  
  const businesses = data.data || [];
  const pagination = data.pagination;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business Name</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {businesses?.length > 0 ? (
            businesses.map((business) => (
              <TableRow key={business.id}>
                <TableCell className="font-medium">{business.name}</TableCell>
                <TableCell>{business.industry}</TableCell>
                <TableCell>
                  <Badge className={statusColors[business.status] || 'bg-gray-100'}>
                    {business.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {typeof business.contact === 'object' ? (
                    <div className="flex flex-col">
                      <span className="text-sm">{business.contact.email}</span>
                      <span className="text-xs text-gray-500">{business.contact.phone}</span>
                    </div>
                  ) : (
                    <span className="text-sm">{business.contact}</span>
                  )}
                </TableCell>
                <TableCell>
                  {business.lastUpdated ? 
                    format(new Date(business.lastUpdated), 'MMM d, yyyy') : 
                    'N/A'}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                No businesses found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          basePath="/dashboard/business"
          searchParams={searchParams}
          className="justify-center"
        />
      )}
    </div>
  );
} 