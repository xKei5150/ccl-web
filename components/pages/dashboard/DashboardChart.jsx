'use client';

import { memo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';

function ChartSkeleton() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="w-full h-[350px] rounded-lg bg-gradient-to-r from-muted/20 via-muted/50 to-muted/20 animate-shimmer" />
    </div>
  );
}

const DashboardChart = memo(({ data }) => {
  if (!data) return <ChartSkeleton />;

  const chartData = data.map(item => ({
    ...item,
    requestsGradient: item.requests,
    permitsGradient: item.permits,
    householdsGradient: item.households,
  }));

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="requestsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="permitsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="householdsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            vertical={false}
            stroke="hsl(var(--muted-foreground))"
            strokeOpacity={0.1}
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="requests"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#requestsGradient)"
            fillOpacity={1}
            activeDot={{ r: 6, fill: "hsl(var(--primary))", strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="permits"
            stroke="hsl(var(--secondary))"
            strokeWidth={2}
            fill="url(#permitsGradient)"
            fillOpacity={1}
            activeDot={{ r: 6, fill: "hsl(var(--secondary))", strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="households"
            stroke="hsl(var(--warning))"
            strokeWidth={2}
            fill="url(#householdsGradient)"
            fillOpacity={1}
            activeDot={{ r: 6, fill: "hsl(var(--warning))", strokeWidth: 0 }}
          />
          <Legend 
            verticalAlign="top"
            height={36}
            content={<CustomLegend />}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

const CustomLegend = memo(({ payload }) => {
  if (!payload) return null;

  return (
    <div className="flex gap-6 justify-center mb-6">
      {payload.map((entry) => (
        <div 
          key={entry.value}
          className={cn(
            "flex items-center gap-2",
            entry.value === "requests" && "text-primary",
            entry.value === "permits" && "text-secondary",
            entry.value === "households" && "text-warning"
          )}
        >
          <div className="h-3 w-3 rounded-full bg-current" />
          <span className="text-sm font-medium capitalize">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
});

const CustomTooltip = memo(({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3 shadow-xl">
      <div className="space-y-2">
        <div className="font-medium text-sm text-muted-foreground border-b pb-1">
          {label}
        </div>
        <div className="grid gap-1.5">
          {payload.map((entry) => (
            <div 
              key={entry.dataKey}
              className={cn(
                "flex items-center justify-between gap-3",
                entry.dataKey === "requests" && "text-primary",
                entry.dataKey === "permits" && "text-secondary",
                entry.dataKey === "households" && "text-warning"
              )}
            >
              <span className="text-[13px] capitalize">{entry.dataKey}</span>
              <span className="font-medium tabular-nums">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

DashboardChart.displayName = 'DashboardChart';
CustomLegend.displayName = 'CustomLegend';
CustomTooltip.displayName = 'CustomTooltip';

export default DashboardChart;