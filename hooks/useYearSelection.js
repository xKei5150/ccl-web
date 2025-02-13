import { useState, useEffect } from 'react';

export function useYearSelection(availableYears) {
  const currentYear = new Date().getFullYear();
  const defaultYear = availableYears?.includes(currentYear) ? currentYear : availableYears?.[0];
  const [selectedYear, setSelectedYear] = useState(defaultYear);

  useEffect(() => {
    if (!availableYears?.includes(selectedYear)) {
      setSelectedYear(defaultYear);
    }
  }, [availableYears, selectedYear, defaultYear]);

  const handleYearChange = (year) => {
    if (availableYears?.includes(year)) {
      setSelectedYear(year);
    }
  };

  return {
    selectedYear,
    setSelectedYear: handleYearChange,
  };
}