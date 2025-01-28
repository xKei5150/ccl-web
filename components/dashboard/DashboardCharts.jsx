import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

// Updated data with separate predictions for each category
const data = [
  {
    month: "Jan",
    requests: 40,
    requestsPredicted: 42,
    reports: 24,
    reportsPredicted: 26,
    records: 35,
    recordsPredicted: 37
  },
  {
    month: "Feb",
    requests: 30,
    requestsPredicted: 35,
    reports: 13,
    reportsPredicted: 18,
    records: 45,
    recordsPredicted: 43
  },
  {
    month: "Mar",
    requests: 20,
    requestsPredicted: 25,
    reports: 38,
    reportsPredicted: 35,
    records: 30,
    recordsPredicted: 32
  },
  {
    month: "Apr",
    requests: 27,
    requestsPredicted: 30,
    reports: 39,
    reportsPredicted: 40,
    records: 28,
    recordsPredicted: 30
  },
  {
    month: "May",
    requests: 45,
    requestsPredicted: 48,
    reports: 48,
    reportsPredicted: 45,
    records: 52,
    recordsPredicted: 50
  },
  {
    month: "Jun",
    requests: 37,
    requestsPredicted: 40,
    reports: 38,
    reportsPredicted: 42,
    records: 42,
    recordsPredicted: 45
  },
];

const Chart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
        <Legend />
        {/* Certificates, Clearances, Assistance */}
        <Area
          type="monotone"
          name="Requests"
          dataKey="requests"
          stroke="#2563eb"
          fill="#2563eb33"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          name="Requests (Predicted)"
          dataKey="requestsPredicted"
          stroke="#2563eb"
          fill="none"
          strokeWidth={2}
          strokeDasharray="4 4"
        />
        {/* Incidents/Blotter */}
        <Area
          type="monotone"
          name="Reports"
          dataKey="reports"
          stroke="#dc2626"
          fill="#dc262633"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          name="Reports (Predicted)"
          dataKey="reportsPredicted"
          stroke="#dc2626"
          fill="none"
          strokeWidth={2}
          strokeDasharray="4 4"
        />
        {/* Personal, Business, Household Info */}
        <Area
          type="monotone"
          name="Records"
          dataKey="records"
          stroke="#16a34a"
          fill="#16a34a33"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          name="Records (Predicted)"
          dataKey="recordsPredicted"
          stroke="#16a34a"
          fill="none"
          strokeWidth={2}
          strokeDasharray="4 4"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const AIAnalysis = ({ type }) => {
  const analyses = {
    requests: {
      trend: "upward",
      percentage: "+12.5%",
      analysis: "Certificate and clearance requests show peak volumes during business permit renewal season. Medical assistance requests increased in residential areas.",
      prediction: "Expected 15% increase in certificate requests next month due to upcoming school enrollment period.",
      insights: [
        "Barangay clearance is most requested (45%)",
        "Medical assistance peaks on weekends",
        "Business permits surge quarterly"
      ],
      recommendations: [
        "Add online certificate pre-application",
        "Schedule additional staff for peak hours",
        "Prepare medical assistance budget allocation"
      ]
    },
    reports: {
      trend: "stable",
      percentage: "+3.2%",
      analysis: "Incident reports show typical patterns with minor increases during festivities. Most common are noise complaints and minor disputes.",
      prediction: "Slight increase in reports expected during upcoming local events.",
      insights: [
        "70% of cases resolved through mediation",
        "Peak reporting hours: 6PM - 10PM",
        "Reduced processing time for blotters"
      ],
      recommendations: [
        "Strengthen night patrol schedules",
        "Enhance mediation procedures",
        "Deploy mobile reporting system"
      ]
    },
    records: {
      trend: "upward",
      percentage: "+8.3%",
      analysis: "Household and business records growing steadily with new residential developments. Data completion rate improved to 89%.",
      prediction: "20% increase in household records expected due to new housing project completion.",
      insights: [
        "New business registrations up 15%",
        "Household data verification improved",
        "Senior citizen registry updated"
      ],
      recommendations: [
        "Conduct household data validation",
        "Update zoning records",
        "Schedule business permit renewals"
      ]
    }
  };

  const analysis = analyses[type];
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {analysis.trend === "upward" && <TrendingUp className="text-green-500" />}
        {analysis.trend === "downward" && <TrendingDown className="text-red-500" />}
        {analysis.trend === "stable" && <AlertCircle className="text-yellow-500" />}
        <span className="font-medium">{analysis.percentage} {analysis.trend}</span>
      </div>
      
      <div className="space-y-4">
        <div className="rounded-lg bg-muted p-4">
          <h4 className="font-medium">Analysis</h4>
          <p className="mt-2 text-sm text-muted-foreground">{analysis.analysis}</p>
        </div>
        
        <div className="rounded-lg bg-muted p-4">
          <h4 className="font-medium">Prediction</h4>
          <p className="mt-2 text-sm text-muted-foreground">{analysis.prediction}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-muted p-4">
            <h4 className="font-medium">Key Insights</h4>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              {analysis.insights.map((insight, index) => (
                <li key={index}>• {insight}</li>
              ))}
            </ul>
          </div>
          
          <div className="rounded-lg bg-muted p-4">
            <h4 className="font-medium">Recommendations</h4>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              {analysis.recommendations.map((rec, index) => (
                <li key={index}>• {rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Barangay Management Overview</CardTitle>
          <CardDescription>
            Monthly activity trends with category-specific predictions
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Chart />
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Certificate Requests</p>
              <p className="text-2xl font-bold">199</p>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Incident Reports</p>
              <p className="text-2xl font-bold">156</p>
              <p className="text-xs text-muted-foreground">+15.3% from last month</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Total Records</p>
              <p className="text-2xl font-bold">232</p>
              <p className="text-xs text-muted-foreground">+18.7% from last month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Insights</CardTitle>
          <CardDescription>
            Category-specific analysis and predictions
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Tabs defaultValue="requests" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="records">Records</TabsTrigger>
            </TabsList>
            <TabsContent value="requests">
              <AIAnalysis type="requests" />
            </TabsContent>
            <TabsContent value="reports">
              <AIAnalysis type="reports" />
            </TabsContent>
            <TabsContent value="records">
              <AIAnalysis type="records" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;