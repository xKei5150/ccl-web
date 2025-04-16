"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Bar, BarChart, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Line, LineChart, CartesianGrid, Legend, PieChart, Pie, Cell } from "recharts";
import { RefreshCw, Filter, SparklesIcon, InfoIcon, ChevronRightIcon, HelpCircleIcon, DownloadIcon, UsersIcon, User, HomeIcon, VoteIcon, AccessibilityIcon, BarChart3Icon, ActivityIcon, HeartPulseIcon, LineChartIcon, CalendarIcon } from "lucide-react";
import DemographicsAIInsights from "./DemographicsAIInsights";
import { calculateDemographicsReportData } from "@/app/(app)/dashboard/demographic-record/actions";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

export default function DemographicsReportsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [availableYears, setAvailableYears] = useState([]);

  // Fetch data and available years
  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    const data = await calculateDemographicsReportData({ year: selectedYear });
    setReportData(data);
    setIsLoading(false);
  }, [selectedYear]);

  // Fetch available years on mount
  useEffect(() => {
    async function fetchYears() {
      const data = await calculateDemographicsReportData({});
      if (Array.isArray(data?.yearlyTrends)) {
        const years = data.yearlyTrends.map(y => y.year).sort((a, b) => b - a);
        setAvailableYears(years);
        if (!selectedYear && years.length > 0) setSelectedYear(years[0].toString());
      }
    }
    fetchYears();
  }, []);

  useEffect(() => {
    if (selectedYear) fetchReports();
  }, [selectedYear, fetchReports]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm border border-blue-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Barangay Demographic Dashboard</h1>
            <p className="mt-1">Yearly population, age, and health profile analytics</p>
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
                  <p>View AI-powered analysis of demographic data</p>
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
                  <SheetDescription>Choose year to view demographic data</SheetDescription>
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
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" onClick={() => setShowFilterPanel(false)}>
                    <Filter className="mr-2 h-4 w-4" />
                    Apply Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" disabled className="flex items-center gap-1">
                    <DownloadIcon className="h-4 w-4" />
                    Export
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export demographic data as CSV (coming soon)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      {/* AI Insights */}
      {showAIInsights && (
        <div className="animate-in fade-in slide-in-from-top-5 duration-300">
          <DemographicsAIInsights selectedYear={selectedYear} />
        </div>
      )}
      {/* Main Reports Section */}
      <div className="bg-white rounded-lg shadow-sm border">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 py-2 border-b">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-muted/50">
              <TabsTrigger value="overview" className="py-2 data-[state=active]:bg-white transition-all flex items-center gap-2">
                <UsersIcon className="h-4 w-4 text-blue-500" />
                <span>Population Overview</span>
              </TabsTrigger>
              <TabsTrigger value="age" className="py-2 data-[state=active]:bg-white transition-all flex items-center gap-2">
                <BarChart3Icon className="h-4 w-4 text-green-500" />
                <span>Age Distribution</span>
              </TabsTrigger>
              <TabsTrigger value="health" className="py-2 data-[state=active]:bg-white transition-all flex items-center gap-2">
                <HeartPulseIcon className="h-4 w-4 text-rose-500" />
                <span>Health Profile</span>
              </TabsTrigger>
              <TabsTrigger value="trends" className="py-2 data-[state=active]:bg-white transition-all flex items-center gap-2">
                <LineChartIcon className="h-4 w-4 text-indigo-500" />
                <span>Yearly Trends</span>
              </TabsTrigger>
            </TabsList>
          </div>
          {/* Population Overview Tab */}
          <TabsContent value="overview" className="p-6 space-y-6 animate-in fade-in-50 duration-200">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">Loading...</div>
            ) : (
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <UsersIcon className="h-5 w-5 text-blue-500" />
                  <CardTitle>Total Population</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-3xl font-bold">{reportData?.population?.total ?? "-"}</span>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <User className="h-5 w-5 text-cyan-500" />
                  <CardTitle>Male</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-3xl font-bold">{reportData?.population?.male ?? "-"}</span>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <User className="h-5 w-5 text-pink-400" />
                  <CardTitle>Female</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-3xl font-bold">{reportData?.population?.female ?? "-"}</span>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <HomeIcon className="h-5 w-5 text-amber-500" />
                  <CardTitle>Households</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-3xl font-bold">{reportData?.population?.households ?? "-"}</span>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <VoteIcon className="h-5 w-5 text-lime-600" />
                  <CardTitle>Voters</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-3xl font-bold">{reportData?.population?.voters ?? "-"}</span>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <AccessibilityIcon className="h-5 w-5 text-violet-500" />
                  <CardTitle>PWDs</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-3xl font-bold">{reportData?.population?.pwd ?? "-"}</span>
                </CardContent>
              </Card>
            </div>
            )}
          </TabsContent>
          {/* Age Distribution Tab */}
          <TabsContent value="age" className="p-6 space-y-6 animate-in fade-in-50 duration-200">
            <Card>
              <CardHeader>
                <CardTitle>Age Groups</CardTitle>
                <CardDescription>Population by age group</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                {isLoading ? (
                  <div className="flex h-full items-center justify-center">Loading...</div>
                ) : Array.isArray(reportData?.ageGroups) && reportData.ageGroups.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reportData.ageGroups} margin={{ left: 30 }} barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="ageRange" axisLine={false} tickLine={false} />
                      <YAxis width={40} axisLine={false} tickLine={false} />
                      <RechartsTooltip />
                      <Bar dataKey="count" name="Population" radius={[4, 4, 0, 0]}>
                        {reportData.ageGroups.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">No age group data available</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          {/* Health Profile Tab */}
          <TabsContent value="health" className="p-6 space-y-6 animate-in fade-in-50 duration-200">
            <Card>
              <CardHeader>
                <CardTitle>Chronic Diseases</CardTitle>
                <CardDescription>Population with chronic diseases</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                {isLoading ? (
                  <div className="flex h-full items-center justify-center">Loading...</div>
                ) : Array.isArray(reportData?.chronicDiseases) && reportData.chronicDiseases.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reportData.chronicDiseases}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="diseaseName"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        animationDuration={500}
                        animationBegin={0}
                      >
                        {reportData.chronicDiseases.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">No health data available</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          {/* Yearly Trends Tab */}
          <TabsContent value="trends" className="p-6 space-y-6 animate-in fade-in-50 duration-200">
            <Card>
              <CardHeader>
                <CardTitle>Yearly Trends</CardTitle>
                <CardDescription>Population and voter trends over years</CardDescription>
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
                      <Line type="monotone" dataKey="total" stroke={COLORS[0]} name="Total Population" strokeWidth={2} dot={{ r: 4, fill: COLORS[0] }} activeDot={{ r: 6, fill: COLORS[0] }} />
                      <Line type="monotone" dataKey="voters" stroke={COLORS[1]} name="Voters" strokeWidth={2} dot={{ r: 4, fill: COLORS[1] }} activeDot={{ r: 6, fill: COLORS[1] }} />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <span className="text-sm flex items-center gap-1"><CalendarIcon className="h-4 w-4 text-blue-400" />Selected Year</span>
              <span className="font-medium">{selectedYear}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm flex items-center gap-1"><RefreshCw className="h-4 w-4 text-green-400" />Last Updated</span>
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