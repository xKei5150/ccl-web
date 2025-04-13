'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  TrendingUpIcon, TrendingDownIcon, 
  LightbulbIcon, ActivityIcon,
  Target, BarChart2Icon,
  Users, Files,
  FileCheck, BrainCircuitIcon, BarChart3Icon, Award
} from "lucide-react";
import { cn } from '@/lib/style-utils';
import DashboardChart from './DashboardChart';
import { PredictionsTab } from './PredictionsTab';
import { useFetchData } from '@/lib/client-data';
import { Loading } from '@/components/ui/loading';

/**
 * Main dashboard charts component using React Query for data fetching
 * 
 * @param {Object} props Component props
 * @param {Array} props.initialData Initial data from server
 * @param {Array} props.availableYears Available years for selection
 * @param {number} props.initialYear Initial selected year
 * @returns {JSX.Element} Dashboard charts component
 */
export function DashboardCharts({ initialData, availableYears, initialYear }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentYear = searchParams.get('year') || initialYear.toString();
  const [selectedMetric, setSelectedMetric] = useState('requests');

  function handleYearChange(year) {
    const params = new URLSearchParams(searchParams);
    params.set('year', year);
    router.push(`?${params.toString()}`, { scroll: false });
  }

  const metrics = [
    { id: 'requests', label: 'Requests', icon: Files },
    { id: 'permits', label: 'Permits', icon: FileCheck },
    { id: 'households', label: 'Households', icon: Users }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Analytics Overview</h2>
          <p className="text-sm text-muted-foreground">
            Monitor key metrics and trends across your organization
          </p>
        </div>
        <Select defaultValue={currentYear} onValueChange={handleYearChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map(year => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart2Icon className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <BrainCircuitIcon className="h-4 w-4" />
            Predictions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {metrics.map(({ id, label, icon: Icon }) => (
              <MetricCard 
                key={id}
                title={label}
                value={sumMetric(initialData, id)}
                icon={Icon}
                isSelected={selectedMetric === id}
                onClick={() => setSelectedMetric(id)}
              />
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2Icon className="h-5 w-5 text-primary" />
                  Activity Trends
                </CardTitle>
                <CardDescription>
                  Track monthly changes in requests, permits, and households
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <DashboardChart data={initialData} />
                </div>
              </CardContent>
            </Card>

            <AnalyticsCard metric={selectedMetric} year={parseInt(currentYear)} />
          </div>
        </TabsContent>

        <TabsContent value="predictions">
          <PredictionsTab data={initialData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * Card component for displaying metrics
 */
function MetricCard({ title, value, icon: Icon, isSelected, onClick }) {
  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all hover:border-primary cursor-pointer group",
        isSelected && "border-primary ring-1 ring-primary"
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      <CardHeader className="relative pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Icon className={cn(
            "h-4 w-4 transition-colors",
            isSelected ? "text-primary" : "text-muted-foreground"
          )} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Badge variant={isSelected ? "default" : "secondary"} className="text-xs">
            View Analysis
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Analytics card component using React Query
 */
function AnalyticsCard({ metric, year }) {
  // Use React Query for data fetching
  const { data: analytics, isLoading, isError } = useFetchData(
    ['analytics', metric, year],
    `/api/dashboard/analytics?metric=${metric}&year=${year}`,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1
    }
  );

  if (isLoading) return <AnalyticsCardSkeleton />;
  if (isError) return <AnalyticsError />;
  if (!analytics) return null;

  const { trend, percentChange, insights, recommendations, stats } = analytics;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuitIcon className="h-5 w-5 text-primary" />
          Analytics for {metric}
        </CardTitle>
        <CardDescription>
          {trend === 'increasing' ? (
            <div className="flex items-center gap-1.5">
              <Badge variant="success" className="gap-1">
                <TrendingUpIcon className="h-3.5 w-3.5" />
                {percentChange} increase
              </Badge>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Badge variant="destructive" className="gap-1">
                <TrendingDownIcon className="h-3.5 w-3.5" />
                {percentChange} decrease
              </Badge>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="insights" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="insights" className="gap-2">
              <ActivityIcon className="h-4 w-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="gap-2">
              <LightbulbIcon className="h-4 w-4" />
              Actions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <StatsCard
                title="Total"
                value={stats.total}
                icon={BarChart2Icon}
              />
              <StatsCard
                title="Average"
                value={stats.average}
                icon={BarChart3Icon}
              />
              <StatsCard
                title="Highest"
                value={stats.max}
                icon={Target}
              />
              <StatsCard
                title="Lowest"
                value={stats.min}
                icon={Award}
              />
            </div>
            
            <ScrollArea className="h-[180px] pr-4">
              <div className="space-y-2">
                {insights.map((insight, i) => (
                  <Card key={i} className="p-3 bg-muted/50">
                    <p className="text-sm">{insight}</p>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-4">
            <ScrollArea className="h-[320px] pr-4">
              <div className="space-y-3">
                {recommendations.map((recommendation, i) => (
                  <Card key={i} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">{i+1}</span>
                      </div>
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

/**
 * Error state for analytics card
 */
function AnalyticsError() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-destructive/10 p-3 mb-4">
          <ActivityIcon className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="text-lg font-medium mb-2">Failed to load analytics</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          There was a problem loading analytics data. Please try again later.
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * Stats card for displaying analytics values
 */
function StatsCard({ title, value, icon: Icon }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-full h-8 w-8 bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </div>
    </Card>
  );
}

/**
 * Loading skeleton for analytics card
 */
function AnalyticsCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="space-y-2">
          <div className="h-5 w-1/3 bg-muted rounded animate-pulse"></div>
          <div className="h-4 w-1/4 bg-muted rounded animate-pulse"></div>
        </div>
      </CardHeader>
      <CardContent>
        <Loading variant="skeleton" />
      </CardContent>
    </Card>
  );
}

/**
 * Helper function to sum metric values
 */
function sumMetric(data, metric) {
  return data.reduce((total, item) => total + (item[metric] || 0), 0);
}