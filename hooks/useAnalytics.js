import { useEffect, useState } from 'react';
import { generateAnalysis } from '@/lib/actions/dashboard-actions';

export function useAnalytics(type, data) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let mounted = true;

    async function fetchAnalysis() {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const analysis = await generateAnalysis(type, data);
        
        if (mounted) {
          setState({
            data: analysis,
            loading: false,
            error: null
          });
        }
      } catch (err) {
        if (mounted) {
          setState({
            data: null,
            loading: false,
            error: err?.message || 'Failed to generate analysis'
          });
        }
      }
    }

    if (data?.length) {
      fetchAnalysis();
    }

    return () => {
      mounted = false;
    };
  }, [type, data]);

  return state;
}