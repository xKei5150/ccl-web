// hooks/use-query-params.js
import { useCallback } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (params) => {
      const newSearchParams = new URLSearchParams(searchParams);

      // Handle object of params
      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });

      return newSearchParams.toString();
    },
    [searchParams]
  );

  const setQueryParams = useCallback(
    (params) => {
      const queryString = createQueryString(params);
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
    },
    [pathname, router, createQueryString]
  );

  const getQueryParam = useCallback(
    (key) => {
      return searchParams.get(key);
    },
    [searchParams]
  );

  const getAllQueryParams = useCallback(() => {
    const params = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  const removeQueryParams = useCallback(
    (keys) => {
      const newSearchParams = new URLSearchParams(searchParams);
      (Array.isArray(keys) ? keys : [keys]).forEach((key) => {
        newSearchParams.delete(key);
      });
      router.push(`${pathname}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""}`);
    },
    [pathname, router, searchParams]
  );

  const clearQueryParams = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  return {
    setQueryParams,
    getQueryParam,
    getAllQueryParams,
    removeQueryParams,
    clearQueryParams,
  };
}