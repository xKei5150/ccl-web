"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Bar, BarChart, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Line, LineChart, CartesianGrid, Legend, PieChart, Pie, Cell } from "recharts";
import { FileText, Filter, SparklesIcon, InfoIcon, ChevronRightIcon, DownloadIcon, BarChart3Icon, BadgeAlertIcon, LineChartIcon, CalendarIcon, LayersIcon, RefreshCw, BrainCircuitIcon, CalendarDaysIcon } from "lucide-react";
import { calculateReportsDashboardData, analyzeReportTrendsAI, analyzeReportInsightsAI } from "@/app/(app)/dashboard/reports-stat/actions";
import ExportButton from "@/components/pages/reports-stat/ExportButton";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];
const STATUSES = [
  { label: "All Statuses", value: "all" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "inProgress" },
  { label: "Closed", value: "closed" },
];
const TYPES = [
  { label: "All Types", value: "all" },
  { label: "Incident", value: "incident" },
  { label: "Accident", value: "accident" },
  { label: "Disaster", value: "disaster" },
  { label: "Other", value: "other" },
];

const months = [
  { value: "all", label: "All Months" }, { value: "01", label: "January" }, { value: "02", label: "February" },
  { value: "03", label: "March" }, { value: "04", label: "April" }, { value: "05", label: "May" },
  { value: "06", label: "June" }, { value: "07", label: "July" }, { value: "08", label: "August" },
  { value: "09", label: "September" }, { value: "10", label: "October" }, { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export default function ReportsDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [availableYears, setAvailableYears] = useState(["2024", "2023", "2022"]); // Placeholder

  // Replace placeholder fetch with real fetch
  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    const data = await calculateReportsDashboardData({ 
      year: selectedYear === 'all' ? '' : selectedYear, 
      month: selectedMonth === 'all' ? '' : selectedMonth,
      status: selectedStatus 
    });
    setReportData(data);
    // Dynamically set available years from data
    if (Array.isArray(data?.yearlyTrends)) {
      const years = data.yearlyTrends.map(y => y.year).sort((a, b) => b - a).map(String);
      setAvailableYears(['all', ...years]); // Add 'all' option
      if (!selectedYear) setSelectedYear('all'); // Default to 'all'
    } else {
      setAvailableYears(['all', '2024', '2023', '2022']); // Fallback
      if (!selectedYear) setSelectedYear('all');
    }
    setIsLoading(false);
  }, [selectedYear, selectedMonth, selectedStatus]);

  useEffect(() => { fetchReports(); }, [selectedYear, selectedMonth, selectedStatus, fetchReports]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm border border-blue-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Barangay Reports Dashboard</h1>
            <p className="mt-1">Incidents, accidents, disasters, and more</p>
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
                  <p>View AI-powered analysis of reports data</p>
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
                  <SheetDescription>Choose year, month, status, and type to filter reports</SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="year-filter">Year</Label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger id="year-filter">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableYears.map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
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
                  <div className="space-y-2">
                    <Label htmlFor="status-filter">Status</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger id="status-filter">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map(s => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type-filter">Type</Label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger id="type-filter">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {TYPES.map(t => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" onClick={() => { fetchReports(); setShowFilterPanel(false); }}>
                    <Filter className="mr-2 h-4 w-4" />
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
                    year={selectedYear === 'all' ? '' : selectedYear}
                    month={selectedMonth === 'all' ? '' : selectedMonth}
                    status={selectedStatus}
                    variant="outline"
                    className="flex items-center gap-1"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export reports data as CSV</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      {/* AI Insights */}
      {showAIInsights && (
        <div className="animate-in fade-in slide-in-from-top-5 duration-300">
          <ReportsAIInsights 
            selectedYear={selectedYear === 'all' ? '' : selectedYear} 
            selectedMonth={selectedMonth === 'all' ? '' : selectedMonth}
            selectedStatus={selectedStatus} 
          />
        </div>
      )}
      {/* Main Reports Section */}
      <div className="bg-white rounded-lg shadow-sm border">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 py-2 border-b">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-muted/50">
              <TabsTrigger value="overview" className="py-2 data-[state=active]:bg-white transition-all flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="status" className="py-2 data-[state=active]:bg-white transition-all flex items-center gap-2">
                <BadgeAlertIcon className="h-4 w-4 text-amber-500" />
                <span>Status</span>
              </TabsTrigger>
              <TabsTrigger value="types" className="py-2 data-[state=active]:bg-white transition-all flex items-center gap-2">
                <BrainCircuitIcon className="h-4 w-4 text-green-500" />
                <span>AI Types</span>
              </TabsTrigger>
              <TabsTrigger value="trends" className="py-2 data-[state=active]:bg-white transition-all flex items-center gap-2">
                <LineChartIcon className="h-4 w-4 text-indigo-500" />
                <span>Trends</span>
              </TabsTrigger>
            </TabsList>
          </div>
          {/* Overview Tab */}
          <TabsContent value="overview" className="p-6 space-y-6 animate-in fade-in-50 duration-200">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">Loading...</div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <CardTitle>Total Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-3xl font-bold">{reportData?.overview?.total ?? "-"}</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center gap-2">
                    <BadgeAlertIcon className="h-5 w-5 text-amber-500" />
                    <CardTitle>Open</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-3xl font-bold">{reportData?.overview?.open ?? "-"}</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center gap-2">
                    <BadgeAlertIcon className="h-5 w-5 text-yellow-500" />
                    <CardTitle>In Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-3xl font-bold">{reportData?.overview?.inProgress ?? "-"}</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center gap-2">
                    <BadgeAlertIcon className="h-5 w-5 text-green-500" />
                    <CardTitle>Closed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-3xl font-bold">{reportData?.overview?.closed ?? "-"}</span>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          {/* Status Tab */}
          <TabsContent value="status" className="p-6 space-y-6 animate-in fade-in-50 duration-200">
            <Card>
              <CardHeader>
                <CardTitle>Reports by Status</CardTitle>
                <CardDescription>Distribution of reports by status</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                {isLoading ? (
                  <div className="flex h-full items-center justify-center">Loading...</div>
                ) : Array.isArray(reportData?.byStatus) && reportData.byStatus.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reportData.byStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="status"
                        label={({ status, percent }) => `${status}: ${(percent * 100).toFixed(0)}%`}
                        animationDuration={500}
                        animationBegin={0}
                      >
                        {reportData.byStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">No status data available</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          {/* Types Tab - Placeholder */}
          <TabsContent value="types" className="p-6 space-y-6 animate-in fade-in-50 duration-200">
             <Card>
              <CardHeader>
                <CardTitle>Report Types (AI Categorized)</CardTitle>
                <CardDescription>View AI-based categorization in the Insights panel</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BrainCircuitIcon className="mx-auto h-12 w-12 mb-4" />
                  <p>Detailed breakdown by type is available in the AI Insights panel.</p>
                   <Button variant="link" onClick={() => setShowAIInsights(true)}>Open AI Insights</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Trends Tab */}
          <TabsContent value="trends" className="p-6 space-y-6 animate-in fade-in-50 duration-200">
            <Card>
              <CardHeader>
                <CardTitle>Yearly Trends</CardTitle>
                <CardDescription>Reports over the years</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                {isLoading ? (
                  <div className="flex h-full items-center justify-center">Loading...</div>
                ) : Array.isArray(reportData?.yearlyTrends) && reportData.yearlyTrends.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={reportData.yearlyTrends} margin={{ left: 35 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} />
                      <YAxis width={40} axisLine={false} tickLine={false} />
                      <RechartsTooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke={COLORS[0]} name="Reports" strokeWidth={2} dot={{ r: 4, fill: COLORS[0] }} activeDot={{ r: 6, fill: COLORS[0] }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">No trend data available</div>
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
              <span className="font-medium">{selectedYear === 'all' ? 'All Years' : selectedYear}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm flex items-center gap-1"><CalendarDaysIcon className="h-4 w-4 text-purple-400" />Selected Month</span>
              <span className="font-medium">{months.find(m => m.value === selectedMonth)?.label ?? "All Months"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm flex items-center gap-1"><LayersIcon className="h-4 w-4 text-green-400" />Status</span>
              <span className="font-medium">{STATUSES.find(s => s.value === selectedStatus)?.label ?? "All Statuses"}</span>
            </div>
            <div className="flex items-center justify-end md:col-start-4">
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

// AI Insights component 
function ReportsAIInsights({ selectedYear, selectedMonth, selectedStatus }) {
  const [trendsInsights, setTrendsInsights] = useState(null);
  const [categoriesInsights, setCategoriesInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchAIAnalyses() {
      setIsLoading(true);
      try {
        // Get dashboard data first
        const dashboardData = await calculateReportsDashboardData({
          year: selectedYear,
          month: selectedMonth,
          status: selectedStatus
        });
        
        // Get trends analysis if we have trends data
        if (dashboardData?.trends?.length > 0) {
          const trendsAnalysis = await analyzeReportTrendsAI({
            trends: dashboardData.trends,
            type: selectedMonth ? 'none' : selectedYear ? 'monthly' : 'yearly'
          });
          setTrendsInsights(trendsAnalysis);
        }
        
        // Get report categorization insights
        const insights = await analyzeReportInsightsAI({
          year: selectedYear,
          month: selectedMonth,
          status: selectedStatus
        });
        setCategoriesInsights(insights);
      } catch (error) {
        console.error("Error fetching AI insights:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchAIAnalyses();
  }, [selectedYear, selectedMonth, selectedStatus]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-purple-500" />
            AI Insights
          </CardTitle>
          <CardDescription>Analyzing your reports data...</CardDescription>
        </CardHeader>
        <CardContent className="h-32 flex items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuitIcon className="h-5 w-5 text-amber-500" />
            AI Report Categories
          </CardTitle>
          <CardDescription>
            AI-generated categories based on report content analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {categoriesInsights?.byType?.length > 0 ? (
            <div className="px-6 pt-2 pb-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoriesInsights.byType.slice(0, 6)} // Show top 6 categories
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="type"
                      label={({ type, percent }) => `${type} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {categoriesInsights.byType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value, name, props) => [`${value} reports`, props.payload.type]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Key Insights:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {categoriesInsights.insights.map((insight, i) => (
                      <li key={i}>{insight}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Recommendations:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {categoriesInsights.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              No category insights available for the selected filters.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChartIcon className="h-5 w-5 text-blue-500" />
            Trend Analysis
          </CardTitle>
          <CardDescription>
            AI-powered analysis of report submission trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          {trendsInsights ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-muted-foreground">Trend</span>
                  <div className="text-2xl font-bold">{trendsInsights.trend}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Change</span>
                  <div className="text-2xl font-bold">{trendsInsights.percentageChange}</div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Analysis:</h4>
                <p className="text-sm">{trendsInsights.analysis}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Prediction:</h4>
                <p className="text-sm">{trendsInsights.prediction}</p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Key Insights:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {trendsInsights.insights.map((insight, i) => (
                    <li key={i}>{insight}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              {selectedMonth ? 
                "Select a year without month to view trend analysis" : 
                "No trend insights available for the selected filters."
              }
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 