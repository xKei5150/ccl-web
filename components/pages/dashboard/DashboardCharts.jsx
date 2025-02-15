'use client';

import { Suspense, useState, useEffect } from 'react';
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
import { cn } from '@/lib/utils';
import DashboardChart from './DashboardChart';
import { fetchAnalytics } from '@/lib/actions/dashboard-actions';
import { PredictionsTab } from './PredictionsTab';

export function DashboardCharts({ initialData, availableYears }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentYear = searchParams.get('year') || new Date().getFullYear().toString();
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
            <Card className="lg:col-span-2">
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

            <Suspense fallback={<AnalyticsCardSkeleton />}>
              <AnalyticsCard metric={selectedMetric} year={parseInt(currentYear)} />
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="predictions">
          <Suspense fallback={
            <Card>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
              </CardContent>
            </Card>
          }>
            <PredictionsTab data={initialData} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

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

function AnalyticsCard({ metric, year }) {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setIsLoading(true);
        const data = await fetchAnalytics(metric, year);
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadAnalytics();
  }, [metric, year]);

  if (isLoading) return <AnalyticsCardSkeleton />;
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
                    <div className="flex gap-3 items-start">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                      <p className="text-sm leading-relaxed">{insight}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-4">
            <ScrollArea className="h-[280px] pr-4">
              <div className="space-y-3">
                {recommendations.map((recommendation, i) => (
                  <Card key={i} className="p-4 transition-colors hover:bg-muted/50">
                    <div className="flex gap-3 items-start">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <LightbulbIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm leading-relaxed">{recommendation}</p>
                        <Badge variant="secondary" className="text-xs">
                          Suggested Action
                        </Badge>
                      </div>
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

function StatsCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-lg border bg-card p-3 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm font-medium leading-none">{title}</p>
      </div>
      <p className="mt-2.5 text-2xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

function AnalyticsCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-1/3 bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-4 w-full bg-muted rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

function sumMetric(data, metric) {
  return data.reduce((sum, item) => sum + item[metric], 0);
}