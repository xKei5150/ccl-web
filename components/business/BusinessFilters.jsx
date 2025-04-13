"use client";

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';

export function BusinessFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const currentStatus = searchParams.get('status') || '';
  const currentIndustry = searchParams.get('industry') || '';

  // Create a new URLSearchParams instance
  const createQueryString = (params) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    
    // Update or delete params
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }
    });
    
    // Reset to page 1 when filters change
    if (Object.keys(params).some(key => key !== 'page')) {
      newSearchParams.set('page', '1');
    }
    
    return newSearchParams.toString();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`${pathname}?${createQueryString({ search, page: '1' })}`);
  };

  const handleStatusChange = (value) => {
    // If "all" is selected, remove the status filter
    if (value === "all") {
      value = null;
    }
    router.push(`${pathname}?${createQueryString({ status: value, page: '1' })}`);
  };
  
  const handleIndustryChange = (value) => {
    // If "all" is selected, remove the industry filter
    if (value === "all") {
      value = null;
    }
    router.push(`${pathname}?${createQueryString({ industry: value, page: '1' })}`);
  };
  
  const clearFilters = () => {
    setSearch('');
    router.push(pathname);
  };

  const hasFilters = search || currentStatus || currentIndustry;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search businesses..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button type="submit">Search</Button>
      </form>
      
      <div className="flex flex-wrap gap-2">
        <Select value={currentStatus || "all"} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="Under Review">Under Review</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={currentIndustry || "all"} onValueChange={handleIndustryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            <SelectItem value="Technology">Technology</SelectItem>
            <SelectItem value="Healthcare">Healthcare</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Retail">Retail</SelectItem>
            <SelectItem value="Manufacturing">Manufacturing</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        
        {hasFilters && (
          <Button 
            variant="outline" 
            size="icon"
            onClick={clearFilters}
            title="Clear filters"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
} 