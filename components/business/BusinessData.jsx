import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BusinessList } from './BusinessList';

async function fetchBusinesses({ queryKey }) {
  const [_, params] = queryKey;
  const searchParams = new URLSearchParams();
  
  // Add all search parameters to the URL
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });

  const response = await fetch(`/api/businesses?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch businesses');
  }
  
  return response.json();
}

export function BusinessData({ searchParams = {} }) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  
  const queryParams = {
    page,
    limit,
    status: searchParams.status,
    industry: searchParams.industry,
    search: searchParams.search,
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['businesses', queryParams],
    queryFn: fetchBusinesses,
  });

  const businesses = data?.businesses || [];
  const totalPages = data?.pagination?.totalPages || 0;

  return (
    <BusinessList
      businesses={businesses}
      currentPage={page}
      totalPages={totalPages}
      basePath="/dashboard/businesses"
      searchParams={searchParams}
      isLoading={isLoading}
      error={error}
    />
  );
} 