"use client";

import { useCallback } from "react";
import { useQueryState } from "nuqs";

/**
 * Hook for managing URL query parameters as state
 * 
 * @param {string} param - URL parameter name
 * @param {any} defaultValue - Default parameter value
 * @param {object} options - Parser options
 * @returns {array} URL state and setter
 */
export function useUrlParam(param, defaultValue = "", options = {}) {
  const [value, setValue] = useQueryState(param, {
    defaultValue,
    ...options,
  });

  // Enhanced setter that handles nullish values
  const setParam = useCallback(
    (newValue) => {
      if (newValue === undefined || newValue === null || newValue === "") {
        setValue(null);
      } else {
        setValue(newValue);
      }
    },
    [setValue]
  );

  return [value, setParam];
}

/**
 * Hook for managing filter parameters in URL
 * 
 * @param {object} defaultFilters - Default filter values by param name
 * @param {object} parsers - Parser options by param name
 * @returns {object} Filter values and methods
 */
export function useUrlFilters(defaultFilters = {}, parsers = {}) {
  // Initialize URL parameters for each filter
  const params = Object.entries(defaultFilters).map(([key, defaultValue]) => {
    const [value, setValue] = useUrlParam(
      key, 
      defaultValue, 
      parsers[key] || {}
    );
    
    return { key, value, setValue };
  });

  // Get all filter values as an object
  const filterValues = params.reduce((acc, { key, value }) => {
    if (value !== null && value !== undefined && value !== "") {
      acc[key] = value;
    }
    return acc;
  }, {});

  // Update multiple filters at once
  const updateFilters = useCallback((filterUpdates) => {
    Object.entries(filterUpdates).forEach(([key, value]) => {
      const param = params.find((p) => p.key === key);
      if (param) {
        param.setValue(value);
      }
    });
  }, [params]);

  // Reset all filters to default or empty
  const resetFilters = useCallback(() => {
    params.forEach(({ setValue }) => {
      setValue(null);
    });
  }, [params]);

  return {
    filters: filterValues,
    updateFilters,
    resetFilters,
    // Access individual parameters by name
    getParam: (name) => {
      const param = params.find((p) => p.key === name);
      return param ? [param.value, param.setValue] : [null, () => {}];
    },
  };
}

/**
 * Hook for pagination state in URL
 * 
 * @param {object} options - Pagination options
 * @param {number} options.defaultPage - Default page number
 * @param {number} options.defaultPageSize - Default page size
 * @returns {object} Pagination state and controls
 */
export function useUrlPagination({
  defaultPage = 1,
  defaultPageSize = 10,
} = {}) {
  const [page, setPage] = useUrlParam("page", defaultPage, {
    parse: (value) => {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) || parsed < 1 ? defaultPage : parsed;
    },
  });

  const [pageSize, setPageSize] = useUrlParam("pageSize", defaultPageSize, {
    parse: (value) => {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) || parsed < 1 ? defaultPageSize : parsed;
    },
  });

  const goToPage = useCallback(
    (newPage) => {
      setPage(newPage);
    },
    [setPage]
  );

  const setItemsPerPage = useCallback(
    (newPageSize) => {
      setPageSize(newPageSize);
      setPage(1); // Reset to first page when changing items per page
    },
    [setPageSize, setPage]
  );

  return {
    page: parseInt(page, 10),
    pageSize: parseInt(pageSize, 10),
    goToPage,
    setItemsPerPage,
  };
}

/**
 * Hook that combines URL filters and pagination
 * 
 * @param {object} options - Options for filters and pagination
 * @param {object} options.defaultFilters - Default filter values
 * @param {object} options.parsers - Filter parsers
 * @param {number} options.defaultPage - Default page number
 * @param {number} options.defaultPageSize - Default page size
 * @returns {object} Combined URL state
 */
export function useUrlFilteredPagination({
  defaultFilters = {},
  parsers = {},
  defaultPage = 1,
  defaultPageSize = 10,
} = {}) {
  const urlFilters = useUrlFilters(defaultFilters, parsers);
  const urlPagination = useUrlPagination({ defaultPage, defaultPageSize });

  return {
    ...urlFilters,
    ...urlPagination,
  };
} 