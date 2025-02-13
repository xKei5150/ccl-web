import { useState, useEffect, useCallback } from "react";

function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    //useCallback to prevent infinite loop
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const jsonData = await res.json();
      setData(jsonData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Run only when url or options change

  return { data, loading, error, refetch: fetchData }; // Add a refetch function
}

export default useFetch;
