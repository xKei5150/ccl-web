"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatGovCurrency, ACCOUNT_TYPES, APPROVAL_STATES } from "@/lib/finance-utils";
import { calculateReportData, exportReportData } from "@/app/(app)/dashboard/financing/actions";
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, LineChart, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';
import { FileDown, RefreshCw, Filter } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function FinancingReportsPage() {
  const [activeTab, setActiveTab] = useState("summary");
  
  // Calculate fiscal years dynamically
  const currentYear = new Date().getFullYear();
  const generatedFiscalYears = Array.from({ length: 6 }, (_, i) => `${currentYear - i}-${currentYear - i + 1}`);
  
  const [fiscalYears, setFiscalYears] = useState(generatedFiscalYears);
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fiscalYear, setFiscalYear] = useState("all");
  const [accountType, setAccountType] = useState("all_types");
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  // Function to fetch report data
  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        reportType: activeTab,
        fiscalYear: fiscalYear === "all" ? "" : fiscalYear,
        accountType: accountType === "all_types" ? "" : accountType,
      };
      const data = await calculateReportData(params);
      setReportData(data);
    } catch (error) {
      console.error("Failed to fetch financing reports", error);
      toast({
        title: "Error",
        description: "Failed to fetch financing reports",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, fiscalYear, accountType, toast]);

  // Function to handle export
  const handleExport = async () => {
    try {
      await exportReportData({
        reportType: activeTab,
        data: reportData,
        format: 'csv'
      });
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  // Fetch data when filters change
  useEffect(() => {
    if (activeTab) {
      fetchReports();
    }
  }, [activeTab, fetchReports]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
          <p className="text-muted-foreground">
            Analyze spending and budget performance across departments
          </p>
        </div>
        <Button variant="outline" onClick={handleExport} disabled={!reportData}>
          <FileDown className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <Tabs defaultValue="spending" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
          <TabsTrigger value="budget">Budget vs. Actual</TabsTrigger>
          <TabsTrigger value="trends">Spending Trends</TabsTrigger>
          <TabsTrigger value="approval">Approval Status</TabsTrigger>
        </TabsList>

        <Card>
          <CardHeader>
            <CardTitle>Report Filters</CardTitle>
            <CardDescription>Customize your report view</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fiscal-year">Fiscal Year</Label>
                <Select value={fiscalYear} onValueChange={setFiscalYear}>
                  <SelectTrigger id="fiscal-year">
                    <SelectValue placeholder="Select Fiscal Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {fiscalYears.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="account-type">Account Type</Label>
                <Select value={accountType} onValueChange={setAccountType}>
                  <SelectTrigger id="account-type">
                    <SelectValue placeholder="Select Account Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_types">All Types</SelectItem>
                    <SelectItem value={ACCOUNT_TYPES.CAPITAL_EXPENDITURE}>Capital Expenditure</SelectItem>
                    <SelectItem value={ACCOUNT_TYPES.OPERATIONAL_EXPENDITURE}>Operational Expenditure</SelectItem>
                    <SelectItem value={ACCOUNT_TYPES.GRANT}>Grant</SelectItem>
                    <SelectItem value={ACCOUNT_TYPES.REVENUE}>Revenue</SelectItem>
                    <SelectItem value={ACCOUNT_TYPES.TRANSFER}>Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end space-x-2">
                <Button onClick={fetchReports}>
                  {isLoading ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Filter className="mr-2 h-4 w-4" />
                  )}
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <TabsContent value="spending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Spending by Account Type</CardTitle>
              <CardDescription>Distribution of spending across different account types</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              {reportData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportData.byAccountType}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {reportData.byAccountType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatGovCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  {isLoading ? "Loading data..." : "No data available. Apply filters to view report."}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Spending Categories</CardTitle>
              <CardDescription>Highest spending areas by group</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {reportData?.topSpendingCategories?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.topSpendingCategories}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => formatGovCurrency(value)} />
                    <Bar dataKey="value" fill="#0088FE" name="Amount" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  {isLoading ? "Loading data..." : "No category data available."}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget vs. Actual Spending</CardTitle>
              <CardDescription>Compare budgeted amounts to actual expenditures</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              {reportData?.budgetComparison?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.budgetComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => formatGovCurrency(value)} />
                    <Legend />
                    <Bar dataKey="budget" fill="#0088FE" name="Budgeted" />
                    <Bar dataKey="actual" fill="#00C49F" name="Actual" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  {isLoading ? "Loading data..." : "No budget comparison data available."}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Spending Trends Over Time</CardTitle>
              <CardDescription>Monthly expenditure patterns</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              {reportData?.spendingTrends?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reportData.spendingTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => formatGovCurrency(value)} />
                    <Legend />
                    <Line type="monotone" dataKey="amount" stroke="#0088FE" name="Spending" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  {isLoading ? "Loading data..." : "No trend data available."}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approval" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Records by Approval Status</CardTitle>
              <CardDescription>Distribution of financing records by approval state</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {reportData?.approvalStatus?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.approvalStatus}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => value} />
                    <Bar dataKey="count" fill="#8884d8" name="Count">
                      {reportData.approvalStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  {isLoading ? "Loading data..." : "No approval status data available."}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 