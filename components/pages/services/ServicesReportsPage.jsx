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
import { Bar, BarChart, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Line, LineChart, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';
import { FileDown, RefreshCw, Filter, SparklesIcon, InfoIcon, ChevronRightIcon, HelpCircleIcon, DownloadIcon, ClipboardListIcon, TimerIcon, SmileIcon, LineChartIcon, CalendarIcon, LayersIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import ServicesAIInsights from "./ServicesAIInsights";
import { calculateServiceReportData, exportServiceReportData } from "@/app/(app)/dashboard/services/actions";
import ExportButton from "./ExportButton";

// Updated modern color palette
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

// Service status constants
const SERVICE_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  REJECTED: "rejected",
  CANCELLED: "cancelled"
};

// Service types constants
const SERVICE_TYPES = {
  BUSINESS_PERMIT: "business_permit",
  BARANGAY_CLEARANCE: "barangay_clearance",
  CERTIFICATE_OF_INDIGENCY: "certificate_of_indigency",
  COMMUNITY_TAX_CERTIFICATE: "community_tax_certificate",
  RESIDENCY_CERTIFICATE: "residency_certificate"
};

// Add months array and selectedMonth state
const months = [
  { value: "all", label: "All Months" },
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export default function ServicesReportsPage() {
  const [activeTab, setActiveTab] = useState("requests");
  const [showAIInsights, setShowAIInsights] = useState(false);
  
  // Calculate years dynamically
  const currentYear = new Date().getFullYear();
  const generatedYears = Array.from({ length: 3 }, (_, i) => `${currentYear - i}`);
  
  const [availableYears, setAvailableYears] = useState(generatedYears);
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState("all");
  const [serviceType, setServiceType] = useState("all_types");
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("all");

  // Function to fetch report data
  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        reportType: activeTab,
        year: selectedYear === "all" ? "" : selectedYear,
        month: selectedMonth === "all" ? "" : selectedMonth,
        serviceType: serviceType === "all_types" ? "" : serviceType,
      };
      const data = await calculateServiceReportData(params);
      setReportData(data);
    } catch (error) {
      console.error("Failed to fetch service reports", error);
      toast({
        title: "Error",
        description: "Failed to fetch service reports",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, selectedYear, selectedMonth, serviceType]);

  // Function to handle export
  const handleExport = async () => {
    try {
      const result = await exportServiceReportData({
        reportType: activeTab,
        data: reportData,
        format: 'csv'
      });
      if (result.success) {
        toast({
          title: "Export successful",
          description: "Service data has been exported successfully.",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Export failed",
        description: "Unable to export service data. Please try again.",
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
            <h1 className="text-3xl font-bold tracking-tight">Barangay Services Dashboard</h1>
            <p className="mt-1">
              Monitor service requests, processing times, and resident satisfaction metrics
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
                  <p>View AI-powered analysis of service data</p>
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
                    Customize your service report view
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="year-filter">Year</Label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger id="year-filter">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        {availableYears.map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="service-type-filter">Service Type</Label>
                    <Select value={serviceType} onValueChange={setServiceType}>
                      <SelectTrigger id="service-type-filter">
                        <SelectValue placeholder="Select Service Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_types">All Types</SelectItem>
                        <SelectItem value={SERVICE_TYPES.BUSINESS_PERMIT}>Business Permit</SelectItem>
                        <SelectItem value={SERVICE_TYPES.BARANGAY_CLEARANCE}>Barangay Clearance</SelectItem>
                        <SelectItem value={SERVICE_TYPES.CERTIFICATE_OF_INDIGENCY}>Certificate of Indigency</SelectItem>
                        <SelectItem value={SERVICE_TYPES.COMMUNITY_TAX_CERTIFICATE}>Community Tax Certificate</SelectItem>
                        <SelectItem value={SERVICE_TYPES.RESIDENCY_CERTIFICATE}>Residency Certificate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="month-filter">Month</Label>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger id="month-filter">
                        <SelectValue placeholder="Select Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map(m => (
                          <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                        ))}
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
                    reportType={activeTab}
                    year={selectedYear === "all" ? "" : selectedYear}
                    serviceType={serviceType === "all_types" ? "" : serviceType}
                    variant="outline"
                    className="flex items-center gap-1"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export service data as CSV</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* AI Insights panel with animation */}
      {showAIInsights && (
        <div className="animate-in fade-in slide-in-from-top-5 duration-300">
          <ServicesAIInsights />
        </div>
      )}

      {/* Main Reports Section */}
      <div className="bg-white rounded-lg shadow-sm border">
        <Tabs defaultValue="requests" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 py-2 border-b">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-muted/50">
              <TabsTrigger value="requests" className="py-2 data-[state=active]:bg-white transition-all flex items-center gap-2">
                <ClipboardListIcon className="h-4 w-4 text-blue-500" />
                <span>Requests</span>
              </TabsTrigger>
              <TabsTrigger value="processing" className="py-2 data-[state=active]:bg-white transition-all flex items-center gap-2">
                <TimerIcon className="h-4 w-4 text-green-500" />
                <span>Processing Times</span>
              </TabsTrigger>
              <TabsTrigger value="satisfaction" className="py-2 data-[state=active]:bg-white transition-all flex items-center gap-2">
                <SmileIcon className="h-4 w-4 text-amber-500" />
                <span>Satisfaction</span>
              </TabsTrigger>
              <TabsTrigger value="trends" className="py-2 data-[state=active]:bg-white transition-all flex items-center gap-2">
                <LineChartIcon className="h-4 w-4 text-indigo-500" />
                <span>Trends</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Active filters display */}
          <div className="px-6 py-4 flex items-center justify-between bg-gray-50 border-b">
            <div className="flex items-center gap-2 text-sm">
              <span>Filters:</span>
              <span className="px-2 py-1 bg-blue-50 rounded-md inline-flex items-center">
                {selectedYear === "all" ? "All Years" : selectedYear}
                <button 
                  className="ml-1 hover:text-blue-600" 
                  onClick={() => setSelectedYear("all")}
                >
                  ×
                </button>
              </span>
              <span className="px-2 py-1 bg-blue-50 rounded-md inline-flex items-center">
                {serviceType === "all_types" ? "All Service Types" : serviceType.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                <button 
                  className="ml-1 hover:text-blue-600" 
                  onClick={() => setServiceType("all_types")}
                >
                  ×
                </button>
              </span>
              <span className="px-2 py-1 bg-blue-50 rounded-md inline-flex items-center">
                {selectedMonth === "all" ? "All Months" : months.find(m => m.value === selectedMonth)?.label}
                <button 
                  className="ml-1 hover:text-blue-600" 
                  onClick={() => setSelectedMonth("all")}
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

          {/* Request Analysis Tab */}
          <TabsContent value="requests" className="p-6 space-y-6 animate-in fade-in-50 duration-200">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-medium">Requests by Service Type</CardTitle>
                      <CardDescription>Distribution across different service categories</CardDescription>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <HelpCircleIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p className="max-w-xs">Visualizes how service requests are distributed across different categories</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardHeader>
                <CardContent className="h-[350px]">
                  {reportData && Array.isArray(reportData.byServiceType) ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={reportData.byServiceType}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          animationDuration={500}
                          animationBegin={0}
                        >
                          {reportData.byServiceType.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
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
                      <CardTitle className="text-lg font-medium">Most Requested Services</CardTitle>
                      <CardDescription>Highest demand service categories</CardDescription>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <HelpCircleIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p className="max-w-xs">Shows the service categories with the highest request volumes</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardHeader>
                <CardContent className="h-[350px]">
                  {reportData?.topRequestedServices?.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={reportData.topRequestedServices} 
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
                          width={30}
                          axisLine={false}
                          tickLine={false}
                        />
                        <RechartsTooltip />
                        <Bar 
                          dataKey="value" 
                          name="Requests" 
                          radius={[4, 4, 0, 0]}
                        >
                          {Array.isArray(reportData.topRequestedServices) && reportData.topRequestedServices.map((entry, index) => (
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
                          <p className="mb-2">No service data available</p>
                          <Button size="sm" onClick={fetchReports}>Load Data</Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Processing Times Tab */}
          <TabsContent value="processing" className="p-6 space-y-6 animate-in fade-in-50 duration-200">
            <Card className="shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-medium">Expected vs. Actual Processing Times</CardTitle>
                    <CardDescription>Compare target processing times to actual performance (in days)</CardDescription>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <HelpCircleIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p className="max-w-xs">Compares target processing times with actual times to track service efficiency</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardHeader>
              <CardContent className="h-[400px]">
                {reportData?.processingTimeComparison?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={reportData.processingTimeComparison} 
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
                        width={30}
                        axisLine={false}
                        tickLine={false}
                      />
                      <RechartsTooltip />
                      <Legend />
                      <Bar 
                        dataKey="expected" 
                        name="Target (days)" 
                        fill={COLORS[0]} 
                        radius={[4, 4, 0, 0]} 
                      />
                      <Bar 
                        dataKey="actual" 
                        name="Actual (days)" 
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
                        <p className="mb-2">No processing time data available</p>
                        <Button size="sm" onClick={fetchReports}>Load Data</Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Service Trends Tab */}
          <TabsContent value="trends" className="p-6 space-y-6 animate-in fade-in-50 duration-200">
            <Card className="shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-medium">Service Request Trends Over Time</CardTitle>
                    <CardDescription>Monthly service request patterns</CardDescription>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <HelpCircleIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p className="max-w-xs">Shows service request patterns over time to identify seasonal trends and anomalies</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardHeader>
              <CardContent className="h-[400px]">
                {reportData?.serviceTrends?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={reportData.serviceTrends} 
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
                        width={40}
                        axisLine={false}
                        tickLine={false}
                      />
                      <RechartsTooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke={COLORS[0]} 
                        name="Requests"
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

          {/* Status Distribution Tab */}
          <TabsContent value="status" className="p-6 space-y-6 animate-in fade-in-50 duration-200">
            <Card className="shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-medium">Requests by Status</CardTitle>
                    <CardDescription>Distribution of service requests by status</CardDescription>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <HelpCircleIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p className="max-w-xs">Shows the status breakdown of all service requests in the system</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardHeader>
              <CardContent className="h-[400px]">
                {reportData?.statusDistribution?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={reportData.statusDistribution} 
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
                      <RechartsTooltip />
                      <Bar 
                        dataKey="count" 
                        name="Count"
                        radius={[0, 4, 4, 0]}
                      >
                        {Array.isArray(reportData.statusDistribution) && reportData.statusDistribution.map((entry, index) => (
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
                        <p className="mb-2">No status data available</p>
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
              <span className="text-sm flex items-center gap-1"><CalendarIcon className="h-4 w-4 text-blue-400" />Selected Year</span>
              <span className="font-medium">{selectedYear === "all" ? "All Years" : selectedYear}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm flex items-center gap-1"><LayersIcon className="h-4 w-4 text-green-400" />Service Type</span>
              <span className="font-medium">{serviceType === "all_types" ? "All Types" : serviceType}</span>
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