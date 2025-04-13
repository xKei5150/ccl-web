"use client";

import { useState } from 'react';
import { useFetchData } from '@/lib/client-data';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Loading } from '@/components/ui/loading';

/**
 * Client-side data table with search and refresh functionality
 * 
 * @param {object} props - Component props
 * @param {Array} props.initialData - Initial data from server
 * @returns {JSX.Element} ClientDataTable component
 */
export function ClientDataTable({ initialData = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Use React Query for client-side data fetching
  const { data, isLoading, isError } = useFetchData(
    ['businesses', searchTerm, refreshTrigger],
    `/api/business${searchTerm ? `?search=${searchTerm}` : ''}`,
    {
      // Use initialData from server for initial render
      initialData: { docs: initialData },
      staleTime: 30000, // 30 seconds
    }
  );
  
  // Get business data from response
  const businesses = data?.docs || [];
  
  // Handle search
  function handleSearch(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    setSearchTerm(formData.get('search'));
  }
  
  // Handle refresh
  function handleRefresh() {
    setRefreshTrigger(prev => prev + 1);
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              name="search"
              placeholder="Search businesses..."
              className="pl-8 w-[250px]"
            />
          </div>
          <Button type="submit" variant="outline" size="sm">
            Search
          </Button>
        </form>
        
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          size="sm"
          disabled={isLoading}
        >
          Refresh
        </Button>
      </div>
      
      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loading variant="spinner" text="Loading data..." />
        </div>
      ) : isError ? (
        <div className="text-center p-8 text-destructive">
          Error loading data. Please try again.
        </div>
      ) : businesses.length === 0 ? (
        <div className="text-center p-8 text-muted-foreground">
          No businesses found.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {businesses.map((business) => (
              <TableRow key={business.id}>
                <TableCell className="font-medium">{business.businessName}</TableCell>
                <TableCell>{business.typeOfOwnership}</TableCell>
                <TableCell>{business.businessEmailAddress}</TableCell>
                <TableCell>
                  <span 
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      business.status === 'active' ? 'bg-green-100 text-green-800' : 
                      business.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                      business.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {business.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
} 