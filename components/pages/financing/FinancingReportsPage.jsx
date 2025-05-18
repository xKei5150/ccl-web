"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatGovCurrency, ACCOUNT_TYPES, APPROVAL_STATES } from "@/lib/finance-utils";
import { calculateReportData, exportReportData } from "@/app/(app)/dashboard/financing/actions";
import { Bar, BarChart, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Line, LineChart, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';
import { FileDown, RefreshCw, Filter, SparklesIcon, InfoIcon, ChevronRightIcon, HelpCircleIcon, DownloadIcon, WalletIcon, BarChart3Icon, LineChartIcon, BadgeCheckIcon, CalendarIcon, LayersIcon, CoinsIcon, TrendingUpIcon, ShieldIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import FinanceAIInsights from "./FinanceAIInsights";
import ExportButton from "@/components/pages/finance/ExportButton";

// Updated modern color palette
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function FinancingReportsPage() {
  const router = useRouter();
  const { isAdmin, isStaff } = useAuth();
  const hasAdminAccess = isAdmin || isStaff;
  
  // If user doesn't have admin access, redirect to financing list
  useEffect(() => {
    if (!hasAdminAccess) {
      router.push('/dashboard/financing');
    }
  }, [hasAdminAccess, router]);
  
  // If not admin, show loading or access denied message
  if (!hasAdminAccess) {
    return (
      <div className="container mx-auto py-20 text-center">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border">
          <ShieldIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Restricted</h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access financial reports and analytics.
          </p>
          <Button onClick={() => router.push('/dashboard/financing')}>
            Back to Financing Records
          </Button>
        </div>
      </div>
    );
  }
  
  const [activeTab, setActiveTab] = useState("spending");
  const [showAIInsights, setShowAIInsights] = useState(false);
  
  // Calculate fiscal years dynamically
  const currentYear = new Date().getFullYear();
  const generatedFiscalYears = Array.from({ length: 6 }, (_, i) => `${currentYear - i}-${currentYear - i + 1}`);
  
  const [fiscalYears, setFiscalYears] = useState(generatedFiscalYears);
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fiscalYear, setFiscalYear] = useState("all");
  const [accountType, setAccountType] = useState("all_types");
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [showFilterPanel, setShowFilterPanel] = useState(false);

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
      toast({
        title: "Export successful",
        description: "Financial data has been exported successfully.",
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Export failed",
        description: "Unable to export financial data. Please try again.",
        variant: "destructive",
      });
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
      {/* Dashboard Header with improved styling */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm border border-blue-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Barangay Financial Reports</h1>
            <p className="mt-1">
              Analyze expenditures and budget performance with interactive visualizations
          </p>
        </div>
          <div className="flex flex-wrap gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={showAIInsights ? "default" : "outline"}
                    className="flex items-center gap-1 transition-all duration-200"
                    onClick={() => setShowAIInsights(!showAIInsights)}
                  >
                    <SparklesIcon className="h-4 w-4" />
                    {showAIInsights ? "Hide AI Insights" : "AI Insights"}
        </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View AI-powered analysis of financial data</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Sheet open={showFilterPanel} onOpenChange={setShowFilterPanel}>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <InfoIcon className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Report Filters</SheetTitle>
                  <SheetDescription>
                    Customize your financial report view
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-6">
              <div className="space-y-2">
                    <Label htmlFor="fiscal-year-filter">Fiscal Year</Label>
                <Select value={fiscalYear} onValueChange={setFiscalYear}>
                      <SelectTrigger id="fiscal-year-filter">
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
                    <Label htmlFor="account-type-filter">Account Type</Label>
                <Select value={accountType} onValueChange={setAccountType}>
                      <SelectTrigger id="account-type-filter">
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
              
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      fetchReports();
                      setShowFilterPanel(false);
                    }}
                  >
                  {isLoading ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Filter className="mr-2 h-4 w-4" />
                  )}
                  Apply Filters
                </Button>
              </div>
              </SheetContent>
            </Sheet>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ExportButton 
                    analysisType={activeTab}
                    variant="outline"
                    className="flex items-center gap-1"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export financial data as CSV</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* AI Insights panel with animation */}
      {showAIInsights && (
        <div className="animate-in fade-in slide-in-from-top-5 duration-300">
          <FinanceAIInsights />
        </div>
      )}

      {/* Main Reports Section */}
      <div className="bg-white rounded-lg shadow-sm border">
        <Tabs defaultValue="spending" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 py-2 border-b">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-muted/50">
              <TabsTrigger value="spending" className="py-2 data-[state=active]:bg-white transition-all flex items-center gap-2">
                <WalletIcon className="h-4 w-4 text-blue-500" />
                <span>Spending Analysis</span>
              </TabsTrigger>
              <TabsTrigger value="budget" className="py-2 data-[state=active]:bg-white transition-all flex items-center gap-2">
                <BarChart3Icon className="h-4 w-4 text-green-500" />
                <span>Budget vs. Actual</span>
              </TabsTrigger>
              <TabsTrigger value="trends" className="py-2 data-[state=active]:bg-white transition-all flex items-center gap-2">
                <TrendingUpIcon className="h-4 w-4 text-indigo-500" />
                <span>Spending Trends</span>
              </TabsTrigger>
              <TabsTrigger value="approval" className="py-2 data-[state=active]:bg-white transition-all flex items-center gap-2">
                <BadgeCheckIcon className="h-4 w-4 text-amber-500" />
                <span>Approval Status</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Active filters display */}
          <div className="px-6 py-4 flex items-center justify-between bg-gray-50 border-b">
            <div className="flex items-center gap-2 text-sm">
              <span>Filters:</span>
              <span className="px-2 py-1 bg-blue-50 rounded-md inline-flex items-center">
                {fiscalYear === "all" ? "All Years" : fiscalYear}
                <button 
                  className="ml-1 hover:text-blue-600" 
                  onClick={() => setFiscalYear("all")}
                >
                  ×
                </button>
              </span>
              <span className="px-2 py-1 bg-blue-50 rounded-md inline-flex items-center">
                {accountType === "all_types" ? "All Account Types" : accountType}
                <button 
                  className="ml-1 hover:text-blue-600" 
                  onClick={() => setAccountType("all_types")}
                >
                  ×
                </button>
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={fetchReports} 
              disabled={isLoading}
              className="text-sm"
            >
              {isLoading ? (
                <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-3 w-3" />
              )}
              Refresh Data
            </Button>
          </div>

          {/* Spending Analysis Tab */}
          <TabsContent value="spending" className="p-6 space-y-6 animate-in fade-in-50 duration-200">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-medium">Spending by Account Type</CardTitle>
                      <CardDescription>Distribution across different account types</CardDescription>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <HelpCircleIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p className="max-w-xs">Visualizes how expenditures are distributed across different account categories</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
            </CardHeader>
                <CardContent className="h-[350px]">
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
                          animationDuration={500}
                          animationBegin={0}
                    >
                      {reportData.byAccountType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                        <RechartsTooltip formatter={(value) => formatGovCurrency(value)} />
                        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                      {isLoading ? (
                        <div className="flex flex-col items-center">
                          <RefreshCw className="h-8 w-8 animate-spin mb-2" />
                          <p className="text-sm">Loading data...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <p className="mb-2">No data available</p>
                          <Button size="sm" onClick={fetchReports}>Load Data</Button>
                        </div>
                      )}
                </div>
              )}
            </CardContent>
          </Card>
          
              <Card className="shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-medium">Top Spending Categories</CardTitle>
              <CardDescription>Highest spending areas by group</CardDescription>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <HelpCircleIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p className="max-w-xs">Shows the categories with the highest expenditures to identify major spending areas</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
            </CardHeader>
                <CardContent className="h-[350px]">
              {reportData?.topSpendingCategories?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={reportData.topSpendingCategories} 
                        margin={{ left: 30 }}
                        barCategoryGap="20%"
                        animationDuration={500}
                        animationBegin={0}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false}
                          tickLine={false}
                        />
                    <YAxis 
                      tickFormatter={(value) => formatGovCurrency(value)} 
                      width={80}
                          axisLine={false}
                          tickLine={false}
                    />
                        <RechartsTooltip formatter={(value) => formatGovCurrency(value)} />
                        <Bar 
                          dataKey="value" 
                          name="Amount" 
                          radius={[4, 4, 0, 0]}
                        >
                          {reportData.topSpendingCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                      {isLoading ? (
                        <div className="flex flex-col items-center">
                          <RefreshCw className="h-8 w-8 animate-spin mb-2" />
                          <p className="text-sm">Loading data...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <p className="mb-2">No category data available</p>
                          <Button size="sm" onClick={fetchReports}>Load Data</Button>
                        </div>
                      )}
                </div>
              )}
            </CardContent>
          </Card>
            </div>
        </TabsContent>

          {/* Budget vs. Actual Tab */}
          <TabsContent value="budget" className="p-6 space-y-6 animate-in fade-in-50 duration-200">
            <Card className="shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-medium">Budget vs. Actual Spending</CardTitle>
              <CardDescription>Compare budgeted amounts to actual expenditures</CardDescription>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <HelpCircleIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p className="max-w-xs">Compares planned budget allocations with actual expenditures to track financial performance</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
            </CardHeader>
              <CardContent className="h-[400px]">
              {reportData?.budgetComparison?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={reportData.budgetComparison} 
                      margin={{ left: 30 }}
                      barCategoryGap="20%"
                      animationDuration={500}
                      animationBegin={0}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        tickFormatter={(value) => formatGovCurrency(value)} 
                        width={80}
                        axisLine={false}
                        tickLine={false}
                      />
                      <RechartsTooltip formatter={(value) => formatGovCurrency(value)} />
                    <Legend />
                      <Bar 
                        dataKey="budget" 
                        name="Budgeted" 
                        fill={COLORS[0]} 
                        radius={[4, 4, 0, 0]} 
                      />
                      <Bar 
                        dataKey="actual" 
                        name="Actual" 
                        fill={COLORS[1]} 
                        radius={[4, 4, 0, 0]} 
                      />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                    {isLoading ? (
                      <div className="flex flex-col items-center">
                        <RefreshCw className="h-8 w-8 animate-spin mb-2" />
                        <p className="text-sm">Loading data...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <p className="mb-2">No budget comparison data available</p>
                        <Button size="sm" onClick={fetchReports}>Load Data</Button>
                      </div>
                    )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

          {/* Spending Trends Tab */}
          <TabsContent value="trends" className="p-6 space-y-6 animate-in fade-in-50 duration-200">
            <Card className="shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-medium">Spending Trends Over Time</CardTitle>
              <CardDescription>Monthly expenditure patterns</CardDescription>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <HelpCircleIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p className="max-w-xs">Shows spending patterns over time to identify seasonal trends and anomalies</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
            </CardHeader>
              <CardContent className="h-[400px]">
              {reportData?.spendingTrends?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={reportData.spendingTrends} 
                      margin={{ left: 35 }}
                      animationDuration={500}
                      animationBegin={0}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        tickFormatter={(value) => formatGovCurrency(value)} 
                        width={80}
                        axisLine={false}
                        tickLine={false}
                      />
                      <RechartsTooltip formatter={(value) => formatGovCurrency(value)} />
                    <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke={COLORS[0]} 
                        name="Spending"
                        strokeWidth={2}
                        dot={{ r: 4, fill: COLORS[0] }}
                        activeDot={{ r: 6, fill: COLORS[0] }}
                      />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                    {isLoading ? (
                      <div className="flex flex-col items-center">
                        <RefreshCw className="h-8 w-8 animate-spin mb-2" />
                        <p className="text-sm">Loading data...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <p className="mb-2">No trend data available</p>
                        <Button size="sm" onClick={fetchReports}>Load Data</Button>
                      </div>
                    )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

          {/* Approval Status Tab */}
          <TabsContent value="approval" className="p-6 space-y-6 animate-in fade-in-50 duration-200">
            <Card className="shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-medium">Records by Approval Status</CardTitle>
              <CardDescription>Distribution of financing records by approval state</CardDescription>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <HelpCircleIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p className="max-w-xs">Shows the approval status breakdown of all financial records in the system</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
            </CardHeader>
              <CardContent className="h-[400px]">
              {reportData?.approvalStatus?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={reportData.approvalStatus} 
                      margin={{ left: 30 }}
                      barCategoryGap="20%"
                      layout="vertical"
                      animationDuration={500}
                      animationBegin={0}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" axisLine={false} tickLine={false} />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        axisLine={false}
                        tickLine={false}
                        width={120}
                      />
                      <RechartsTooltip formatter={(value) => value} />
                      <Bar 
                        dataKey="count" 
                        name="Count"
                        radius={[0, 4, 4, 0]}
                      >
                      {reportData.approvalStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                    {isLoading ? (
                      <div className="flex flex-col items-center">
                        <RefreshCw className="h-8 w-8 animate-spin mb-2" />
                        <p className="text-sm">Loading data...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <p className="mb-2">No approval status data available</p>
                        <Button size="sm" onClick={fetchReports}>Load Data</Button>
                      </div>
                    )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
      
      {/* Dashboard Summary Footer */}
      <Card className="bg-gray-50 shadow-sm border">
        <CardContent className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <span className="text-sm flex items-center gap-1"><CalendarIcon className="h-4 w-4 text-blue-400" />Selected Period</span>
              <span className="font-medium">{fiscalYear === "all" ? "All Years" : fiscalYear}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm flex items-center gap-1"><LayersIcon className="h-4 w-4 text-green-400" />Account Type</span>
              <span className="font-medium">{accountType === "all_types" ? "All Types" : accountType}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm flex items-center gap-1"><RefreshCw className="h-4 w-4 text-indigo-400" />Last Updated</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-end">
              <Button variant="link" className="text-sm flex items-center gap-1" onClick={() => setShowAIInsights(!showAIInsights)}>
                <SparklesIcon className="h-4 w-4 text-yellow-500" />
                {showAIInsights ? "Hide AI Analysis" : "Show AI Analysis"}
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 