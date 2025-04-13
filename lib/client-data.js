"use client";

import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

/**
 * Custom hook for fetching data from API endpoints
 * 
 * @param {string} key - Query key
 * @param {string} url - API endpoint URL
 * @param {object} options - Additional options
 * @returns {object} Query result
 */
export function useFetchData(key, url, options = {}) {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      const res = await fetch(url, { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        ...options
      });
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to fetch data');
      }
      
      return res.json();
    },
    onError: (error) => {
      if (options.showErrorToast !== false) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to fetch data',
          variant: 'destructive',
        });
      }
    },
    ...options,
  });
}

/**
 * Custom hook for submitting data to API endpoints
 * 
 * @param {string} url - API endpoint URL
 * @param {object} options - Additional options
 * @returns {object} Mutation result
 */
export function useSubmitData(url, options = {}) {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const { method = 'POST', onSuccess, onError, invalidateQueries, redirectTo } = options;
  
  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to submit data');
      }
      
      return res.json();
    },
    onSuccess: (data, variables) => {
      if (options.showSuccessToast !== false) {
        toast({
          title: 'Success',
          description: options.successMessage || 'Operation completed successfully',
        });
      }
      
      if (invalidateQueries) {
        if (Array.isArray(invalidateQueries)) {
          invalidateQueries.forEach(query => {
            queryClient.invalidateQueries({ queryKey: Array.isArray(query) ? query : [query] });
          });
        } else {
          queryClient.invalidateQueries({ queryKey: Array.isArray(invalidateQueries) ? invalidateQueries : [invalidateQueries] });
        }
      }
      
      if (redirectTo) {
        router.push(redirectTo);
      }
      
      if (onSuccess) {
        onSuccess(data, variables);
      }
    },
    onError: (error, variables, context) => {
      if (options.showErrorToast !== false) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to submit data',
          variant: 'destructive',
        });
      }
      
      if (onError) {
        onError(error, variables, context);
      }
    },
  });
}

/**
 * Hook for working with paginated data
 * 
 * @param {string} key - Query key
 * @param {string} url - API endpoint URL
 * @param {object} options - Additional options
 * @returns {object} Paginated data and helpers
 */
export function usePaginatedData(key, url, options = {}) {
  const { page = 1, limit = 10, ...queryOptions } = options;
  
  // Build query params
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    
    // Add any additional query params
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
    }
    
    return params.toString();
  }, [page, limit, options.params]);
  
  // Full URL with query params
  const fullUrl = `${url}${queryParams ? `?${queryParams}` : ''}`;
  
  // Use base query hook
  const query = useFetchData([key, page, limit, options.params], fullUrl, {
    keepPreviousData: true,
    ...queryOptions,
  });
  
  return {
    ...query,
    page,
    limit,
    setPage: options.setPage,
    setLimit: options.setLimit,
    // Helper computed properties
    totalPages: query.data?.totalPages || 0,
    totalDocs: query.data?.totalDocs || 0,
    docs: query.data?.docs || [],
    hasNextPage: page < (query.data?.totalPages || 0),
    hasPrevPage: page > 1,
  };
} 