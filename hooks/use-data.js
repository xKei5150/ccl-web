"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Hook for fetching data with loading and error states
 * 
 * @param {function} fetchFn - Function that returns a promise with data
 * @param {object} options - Hook options
 * @param {boolean} options.immediate - Whether to fetch immediately (default: true)
 * @param {any} options.initialData - Initial data value (default: null)
 * @returns {object} Data fetching state and controls
 */
export function useData(fetchFn, { immediate = true, initialData = null } = {}) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [immediate, fetchData]);

  return {
    data,
    setData,
    isLoading,
    error,
    fetchData,
    isError: !!error,
  };
}

/**
 * Hook for pagination with data fetching
 * 
 * @param {function} fetchFn - Function that accepts pagination params and returns data
 * @param {object} options - Hook options
 * @param {number} options.defaultPage - Default page number (default: 1)
 * @param {number} options.defaultPageSize - Default page size (default: 10)
 * @param {boolean} options.immediate - Whether to fetch immediately (default: true)
 * @returns {object} Pagination state and controls
 */
export function usePagination(
  fetchFn,
  { defaultPage = 1, defaultPageSize = 10, immediate = true } = {}
) {
  const [page, setPage] = useState(defaultPage);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPageData = useCallback(
    async (pageToFetch = page, pageSizeToFetch = pageSize) => {
      try {
        const result = await fetchFn({
          page: pageToFetch,
          pageSize: pageSizeToFetch,
        });

        if (result && typeof result === "object") {
          // Handle standard pagination response format
          if (result.data) {
            setTotalItems(result.totalItems || result.total || 0);
            setTotalPages(
              result.totalPages ||
              Math.ceil((result.totalItems || result.total || 0) / pageSizeToFetch)
            );
            return result.data;
          }
          
          // Return the result directly if it doesn't follow the standard format
          return result;
        }
        
        return null;
      } catch (error) {
        console.error("Error fetching paginated data:", error);
        return null;
      }
    },
    [fetchFn, page, pageSize]
  );

  const {
    data,
    isLoading,
    error,
    fetchData: refetch,
    isError,
  } = useData(
    () => fetchPageData(page, pageSize),
    { immediate }
  );

  const goToPage = useCallback(
    async (newPage) => {
      if (newPage < 1 || newPage > totalPages) return;
      setPage(newPage);
      return fetchPageData(newPage, pageSize);
    },
    [fetchPageData, pageSize, totalPages]
  );

  const changePageSize = useCallback(
    async (newPageSize) => {
      const newTotalPages = Math.ceil(totalItems / newPageSize);
      const newPage = page > newTotalPages ? 1 : page;
      
      setPageSize(newPageSize);
      setPage(newPage);
      
      return fetchPageData(newPage, newPageSize);
    },
    [fetchPageData, page, totalItems]
  );

  return {
    data,
    page,
    pageSize,
    totalItems,
    totalPages,
    isLoading,
    error,
    isError,
    goToPage,
    changePageSize,
    refetch,
    setPage,
    setPageSize,
  };
}

/**
 * Hook for filtering data with pagination
 * 
 * @param {function} fetchFn - Function that accepts filters and pagination params
 * @param {object} options - Hook options
 * @param {object} options.defaultFilters - Default filter values
 * @param {number} options.defaultPage - Default page number (default: 1)
 * @param {number} options.defaultPageSize - Default page size (default: 10)
 * @returns {object} Filtered data state and controls
 */
export function useFilteredData(
  fetchFn,
  { defaultFilters = {}, defaultPage = 1, defaultPageSize = 10 } = {}
) {
  const [filters, setFilters] = useState(defaultFilters);
  
  const fetchFilteredData = useCallback(
    async ({ page, pageSize }) => {
      try {
        return await fetchFn({
          ...filters,
          page,
          pageSize,
        });
      } catch (error) {
        console.error("Error fetching filtered data:", error);
        return null;
      }
    },
    [fetchFn, filters]
  );

  const pagination = usePagination(fetchFilteredData, {
    defaultPage,
    defaultPageSize,
    immediate: true,
  });

  const updateFilters = useCallback(
    async (newFilters) => {
      const mergedFilters = { ...filters, ...newFilters };
      setFilters(mergedFilters);
      pagination.setPage(1); // Reset to first page when filters change
      return pagination.refetch();
    },
    [filters, pagination]
  );

  const resetFilters = useCallback(async () => {
    setFilters(defaultFilters);
    pagination.setPage(1);
    return pagination.refetch();
  }, [defaultFilters, pagination]);

  return {
    ...pagination,
    filters,
    updateFilters,
    resetFilters,
  };
} 