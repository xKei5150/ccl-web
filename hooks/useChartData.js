import { useState, useEffect, useCallback } from 'react';
import { getDashboardData } from '@/lib/actions/dashboard-actions';

const RETRY_DELAY = 3000; // 3 seconds
const MAX_RETRIES = 3;

export function useChartData(initialData, selectedYear) {
  const [state, setState] = useState({
    data: initialData,
    yearData: initialData?.filter(item => item.year === selectedYear) || [],
    loading: false,
    error: null,
    retryCount: 0
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { data: newData, error } = await getDashboardData(selectedYear);
      
      if (error) throw new Error(error);

      setState(prev => ({
        data: [...(prev.data || []), ...(newData || [])].filter((v, i, a) => 
          a.findIndex(t => t.year === v.year && t.month === t.month) === i
        ),
        yearData: newData?.filter(item => item.year === selectedYear) || [],
        loading: false,
        error: null,
        retryCount: 0
      }));
    } catch (err) {
      setState(prev => {
        const shouldRetry = prev.retryCount < MAX_RETRIES;
        return {
          ...prev,
          loading: shouldRetry,
          error: shouldRetry ? 'Retrying...' : err?.message || 'Failed to load data',
          retryCount: prev.retryCount + 1
        };
      });
    }
  }, [selectedYear]);

  useEffect(() => {
    let timeoutId;
    
    // Only fetch if we don't have data for the selected year
    const hasYearData = state.data?.some(item => item.year === selectedYear);
    
    if (!hasYearData) {
      void fetchData();
    } else if (state.loading && state.retryCount > 0 && state.retryCount < MAX_RETRIES) {
      timeoutId = setTimeout(fetchData, RETRY_DELAY);
    } else {
      // Update yearData if we already have the data
      setState(prev => ({
        ...prev,
        yearData: prev.data?.filter(item => item.year === selectedYear) || [],
        loading: false
      }));
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [selectedYear, fetchData, state.loading, state.retryCount]);

  return {
    ...state,
    refetch: fetchData
  };
}