"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", requests: 40, reports: 24, records: 35, predicted: 45 },
  { month: "Feb", requests: 30, reports: 13, records: 45, predicted: 38 },
  { month: "Mar", requests: 20, reports: 38, records: 30, predicted: 30 },
  { month: "Apr", requests: 27, reports: 39, records: 28, predicted: 35 },
  { month: "May", requests: 45, reports: 48, records: 52, predicted: 55 },
  { month: "Jun", requests: 37, reports: 38, records: 42, predicted: 48 },
];

const Chart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <XAxis 
          dataKey="month" 
          tickLine={false}
          axisLine={false}
          className="text-sm" 
        />
        <YAxis 
          tickLine={false}
          axisLine={false}
          className="text-sm"
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload) return null;
            return (
              <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="font-medium">{label}</div>
                {payload.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="h-2 w-2 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="requests"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary) / 0.1)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="reports"
          stroke="hsl(var(--destructive))"
          fill="hsl(var(--destructive) / 0.1)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="records"
          stroke="hsl(var(--accent))"
          fill="hsl(var(--accent) / 0.1)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="predicted"
          stroke="hsl(var(--muted-foreground))"
          fill="hsl(var(--muted-foreground) / 0.1)"
          strokeWidth={2}
          strokeDasharray="4 4"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const Dashboard = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-6">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Analytics Overview</h3>
          <p className="text-sm text-muted-foreground">
            Monthly trends with predictive analysis
          </p>
        </div>
        <div className="mt-6">
          <Chart />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Total Requests</p>
            <p className="text-2xl font-bold">199</p>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Completion Rate</p>
            <p className="text-2xl font-bold">87%</p>
            <p className="text-xs text-muted-foreground">+2.4% from last month</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Predictive Analysis</h3>
          <p className="text-sm text-muted-foreground">
            AI-powered insights and predictions
          </p>
        </div>
        <div className="mt-6 space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <h4 className="font-medium">Trend Analysis</h4>
            <p className="mt-2 text-sm text-muted-foreground">
              Based on current trends, we predict a 15% increase in service requests
              over the next month. Citizen engagement is showing positive growth.
            </p>
          </div>
          <div className="rounded-lg bg-muted p-4">
            <h4 className="font-medium">Recommendations</h4>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              <li>• Allocate additional resources for peak mid-month periods</li>
              <li>• Monitor report completion rates as volume increases</li>
              <li>• Consider automated solutions for routine requests</li>
            </ul>
          </div>
          <div className="rounded-lg bg-muted p-4">
            <h4 className="font-medium">Key Metrics</h4>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Response Time</p>
                <p className="text-lg">2.4 hours</p>
              </div>
              <div>
                <p className="text-sm font-medium">Resolution Rate</p>
                <p className="text-lg">92%</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;