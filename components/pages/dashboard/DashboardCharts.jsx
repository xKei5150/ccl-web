'use client';

import { memo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Suspense } from "react";
import { DashboardChart } from "./DashboardChart";
import { DashboardAnalysis } from "./DashboardAnalysis";
import { Skeleton } from "@/components/ui/skeleton";
import { useChartData } from "@/hooks/useChartData";
import { useYearSelection } from "@/hooks/useYearSelection";
import { AlertTriangle } from "lucide-react";
import { TransitionWrapper } from "@/components/ui/transition-wrapper";

function YearSelector({ years, selectedYear, onYearChange, disabled }) {
  return (
    <Select 
      value={selectedYear?.toString()} 
      onValueChange={(value) => onYearChange(parseInt(value, 10))}
      disabled={disabled}
    >
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="Year" />
      </SelectTrigger>
      <SelectContent>
        {years?.map(year => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const StatsCard = memo(({ category, value, change, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <p className="text-sm font-medium">{category}</p>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{change}</p>
    </div>
  );
});

StatsCard.displayName = "StatsCard";

function calculateChange(current = 0, previous = 0) {
  if (!previous) return '+0.0%';
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
}

export const DashboardCharts = memo(({ initialData, availableYears }) => {
  const { selectedYear, setSelectedYear } = useYearSelection(availableYears);
  const { data, yearData, loading, error } = useChartData(initialData, selectedYear);

  const currentMonth = yearData[yearData.length - 7];
  const previousMonth = yearData[yearData.length - 8];

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <div className="flex items-center justify-between mb-2">
            <CardTitle>Barangay Management Overview</CardTitle>
            <YearSelector 
              years={availableYears} 
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              disabled={loading}
            />
          </div>
          <CardDescription>
            Monthly activity trends with category-specific predictions
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <TransitionWrapper isLoading={loading} className="min-h-[300px] relative">
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <DashboardChart data={data} year={selectedYear} />
            )}
          </TransitionWrapper>
          <TransitionWrapper isLoading={loading} className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatsCard
              category="Certificate Requests"
              value={currentMonth?.requests ?? 0}
              change={calculateChange(currentMonth?.requests, previousMonth?.requests)}
              isLoading={loading}
            />
            <StatsCard
              category="Incident Reports"
              value={currentMonth?.reports ?? 0}
              change={calculateChange(currentMonth?.reports, previousMonth?.reports)}
              isLoading={loading}
            />
            <StatsCard
              category="Total Records"
              value={currentMonth?.records ?? 0}
              change={calculateChange(currentMonth?.records, previousMonth?.records)}
              isLoading={loading}
            />
          </TransitionWrapper>
        </CardContent>
      </Card>

      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Insights</CardTitle>
          <CardDescription>
            Category-specific analysis and predictions for {selectedYear}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <TransitionWrapper isLoading={loading} className="min-h-[400px]">
            {loading ? (
              <Skeleton className="h-[400px] w-full" />
            ) : (
              <DashboardAnalysis data={yearData} year={selectedYear} />
            )}
          </TransitionWrapper>
        </CardContent>
      </Card>
    </div>
  );
});

DashboardCharts.displayName = "DashboardCharts";