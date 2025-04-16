"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { formatGovCurrency } from "@/lib/finance-utils";
import { ArrowUpIcon, ArrowDownIcon, ArrowRightIcon, RefreshCw, BrainCircuit, TrendingUpIcon, TrendingDownIcon, BellIcon, AlertTriangleIcon, LightbulbIcon, BriefcaseIcon } from "lucide-react";
import { analyzeFinancialTrends, generateFinancialForecast, analyzeBudgetPerformance } from "@/app/(app)/dashboard/finance/actions";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, BarChart, Bar, Cell, PieChart, Pie, Area, AreaChart, RadialBar, RadialBarChart } from 'recharts';

// Modern color palette for charts
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
const QUARTERLY_COLORS = ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];
const TREND_UP_COLOR = '#10B981';
const TREND_DOWN_COLOR = '#EF4444';
const TREND_STABLE_COLOR = '#F59E0B';

export default function FinanceAIInsights() {
  const [activeTab, setActiveTab] = useState("trends");
  const [trendsAnalysis, setTrendsAnalysis] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [budgetAnalysis, setBudgetAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState({
    trends: false,
    forecast: false,
    budget: false
  });

  // Fetch analysis data based on active tab
  useEffect(() => {
    if (activeTab === "trends" && !trendsAnalysis) {
      fetchTrendsAnalysis();
    } else if (activeTab === "forecast" && !forecastData) {
      fetchForecastData();
    } else if (activeTab === "budget" && !budgetAnalysis) {
      fetchBudgetAnalysis();
    }
  }, [activeTab]);

  // Function to fetch trends analysis
  async function fetchTrendsAnalysis() {
    setIsLoading(prev => ({ ...prev, trends: true }));
    try {
      const data = await analyzeFinancialTrends({});
      setTrendsAnalysis(data);
    } catch (error) {
      console.error("Failed to fetch trends analysis:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, trends: false }));
    }
  }

  // Function to fetch forecast data
  async function fetchForecastData() {
    setIsLoading(prev => ({ ...prev, forecast: true }));
    try {
      const data = await generateFinancialForecast({});
      setForecastData(data);
    } catch (error) {
      console.error("Failed to fetch forecast data:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, forecast: false }));
    }
  }

  // Function to fetch budget analysis
  async function fetchBudgetAnalysis() {
    setIsLoading(prev => ({ ...prev, budget: true }));
    try {
      const data = await analyzeBudgetPerformance({});
      setBudgetAnalysis(data);
    } catch (error) {
      console.error("Failed to fetch budget analysis:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, budget: false }));
    }
  }

  // Generate forecast chart data
  function getForecastChartData() {
    if (!forecastData?.predictions || !forecastData.predictions.length) return [];
    
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    
    // Create historical data (dummy for now)
    // In a real app, this would come from actual data
    const historicalData = months.slice(0, currentMonth + 1).map((month, index) => ({
      month,
      value: Math.floor(Math.random() * 100000) + 50000,
      type: "historical"
    }));
    
    // Map predictions to chart data
    const futureData = forecastData.predictions.map((value, index) => ({
      month: months[currentMonth + 1 + index],
      value,
      type: "forecast"
    }));
    
    return [...historicalData, ...futureData];
  }

  // Generate quarterly projection chart data
  function getQuarterlyChartData() {
    if (!forecastData?.quarterlyProjections) return [];
    
    return [
      { name: 'Q1', value: forecastData.quarterlyProjections.q1 },
      { name: 'Q2', value: forecastData.quarterlyProjections.q2 },
      { name: 'Q3', value: forecastData.quarterlyProjections.q3 },
      { name: 'Q4', value: forecastData.quarterlyProjections.q4 }
    ];
  }

  // Get trend color
  function getTrendColor(trend) {
    if (trend === "upward") return TREND_UP_COLOR;
    if (trend === "downward") return TREND_DOWN_COLOR;
    return TREND_STABLE_COLOR;
  }

  // Render trend icon based on analysis
  function renderTrendIcon(trend) {
    if (trend === "upward") {
      return <TrendingUpIcon className="h-5 w-5" />;
    } else if (trend === "downward") {
      return <TrendingDownIcon className="h-5 w-5" />;
    } else {
      return <ArrowRightIcon className="h-5 w-5" />;
    }
  }

  // Render performance badge for budget analysis
  function renderPerformanceBadge(performance) {
    if (performance === "under_utilized") {
      return <Badge className="bg-blue-50 border-blue-200 hover:bg-blue-100">Under Utilized</Badge>;
    } else if (performance === "over_utilized") {
      return <Badge className="bg-red-50 border-red-200 hover:bg-red-100">Over Utilized</Badge>;
    } else {
      return <Badge className="bg-green-50 border-green-200 hover:bg-green-100">Optimal Utilization</Badge>;
    }
  }

  return (
    <Card className="w-full bg-gradient-to-br from-indigo-50/50 to-blue-50/50 border-blue-100 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-full">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">AI Financial Insights</CardTitle>
              <CardDescription>
                AI-powered analysis for better financial decision-making
              </CardDescription>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-blue-100"
                  onClick={() => {
                    if (activeTab === "trends") fetchTrendsAnalysis();
                    if (activeTab === "forecast") fetchForecastData();
                    if (activeTab === "budget") fetchBudgetAnalysis();
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh AI analysis with latest data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="trends" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-blue-100/50 p-1">
            <TabsTrigger 
              value="trends" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <div className="flex items-center gap-2">
                <TrendingUpIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Expenditure Analysis</span>
                <span className="sm:hidden">Analysis</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="forecast" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <div className="flex items-center gap-2">
                <BriefcaseIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Budget Forecast</span>
                <span className="sm:hidden">Forecast</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="budget" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <div className="flex items-center gap-2">
                <BellIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Fund Utilization</span>
                <span className="sm:hidden">Utilization</span>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Expenditure Analysis Tab */}
          <TabsContent value="trends" className="space-y-6 animate-in fade-in-50 duration-300">
            {isLoading.trends ? (
              <div className="space-y-6">
                <div className="flex justify-center py-8">
                  <div className="flex flex-col items-center">
                    <RefreshCw className="h-12 w-12 animate-spin mb-4" />
                    <p>Analyzing financial data...</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </div>
            ) : trendsAnalysis ? (
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-full" style={{ backgroundColor: getTrendColor(trendsAnalysis.trend) + '20' }}>
                        {renderTrendIcon(trendsAnalysis.trend)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {trendsAnalysis.trend.charAt(0).toUpperCase() + trendsAnalysis.trend.slice(1)} Expenditure Trend
                        </h3>
                        <p className="text-sm">
                          Change of {trendsAnalysis.percentageChange} from previous period
                        </p>
                      </div>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm" onClick={fetchTrendsAnalysis} className="self-start">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Update Analysis
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Refresh analysis with latest financial data</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <Alert className="bg-blue-50 border-blue-200">
                      <AlertTriangleIcon className="h-4 w-4" />
                      <AlertTitle>Expenditure Analysis</AlertTitle>
                      <AlertDescription>
                        {trendsAnalysis.analysis}
                      </AlertDescription>
                    </Alert>
                    
                    <Alert className="bg-indigo-50 border-indigo-200">
                      <AlertTriangleIcon className="h-4 w-4" />
                      <AlertTitle>Fiscal Impact Assessment</AlertTitle>
                      <AlertDescription>
                        {trendsAnalysis.fiscalImpact}
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="shadow-sm hover:shadow-md transition-all bg-white border-blue-100">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <LightbulbIcon className="h-5 w-5" />
                        <CardTitle className="text-base font-medium">Key Insights</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {trendsAnalysis.insights.map((insight, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="min-w-5 pt-0.5">
                              <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-xs font-medium">{index + 1}</span>
                              </div>
                            </div>
                            <span className="text-sm">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm hover:shadow-md transition-all bg-white border-blue-100">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <LightbulbIcon className="h-5 w-5" />
                        <CardTitle className="text-base font-medium">Recommendations</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {trendsAnalysis.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="min-w-5 pt-0.5">
                              <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-xs font-medium">{index + 1}</span>
                              </div>
                            </div>
                            <span className="text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center space-y-4 bg-white rounded-lg shadow-sm p-6">
                <p>No expenditure analysis available</p>
                <Button onClick={fetchTrendsAnalysis} className="bg-blue-600 hover:bg-blue-700">
                  Generate Analysis
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Forecast Tab */}
          <TabsContent value="forecast" className="space-y-6 animate-in fade-in-50 duration-300">
            {isLoading.forecast ? (
              <div className="space-y-6">
                <div className="flex justify-center py-8">
                  <div className="flex flex-col items-center">
                    <RefreshCw className="h-12 w-12 animate-spin mb-4" />
                    <p>Generating budget forecasts...</p>
                  </div>
                </div>
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            ) : forecastData?.predictions?.length > 0 ? (
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">Barangay Expenditure Forecast</h3>
                      <p className="text-sm">Projected expenditures for upcoming fiscal periods</p>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm" onClick={fetchForecastData} className="self-start">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Update Forecast
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Regenerate the expenditure forecast</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="h-64 mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart 
                        data={getForecastChartData()} 
                        margin={{ left: 35, right: 10, bottom: 0, top: 10 }}
                      >
                        <defs>
                          <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.1}/>
                            <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0.05}/>
                          </linearGradient>
                          <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={COLORS[2]} stopOpacity={0.2}/>
                            <stop offset="95%" stopColor={COLORS[2]} stopOpacity={0.05}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="month" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          tickFormatter={(value) => formatGovCurrency(value)} 
                          width={80}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12 }}
                        />
                        <RechartsTooltip 
                          formatter={(value) => formatGovCurrency(value)}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          name="Historical" 
                          stroke={COLORS[0]} 
                          fillOpacity={1}
                          fill="url(#colorHistorical)"
                          strokeWidth={2}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                          dot={{ r: 3, strokeWidth: 0 }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          name="Projected" 
                          stroke={COLORS[2]} 
                          fillOpacity={1}
                          fill="url(#colorForecast)"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          activeDot={{ r: 6, strokeWidth: 0 }}
                          dot={{ r: 3, strokeWidth: 0 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <Card className="shadow-sm hover:shadow-md transition-all bg-white border-blue-100">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base font-medium">Quarterly Budget Projections</CardTitle>
                        <CardDescription>Projected expenditures by fiscal quarter</CardDescription>
                      </div>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <BellIcon className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Government Fiscal Quarters</h4>
                            <p className="text-sm">
                              Quarterly projections help in planning budget allocations according to government fiscal cycles.
                            </p>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart 
                          cx="50%" 
                          cy="50%" 
                          innerRadius="20%" 
                          outerRadius="80%" 
                          barSize={20} 
                          data={getQuarterlyChartData()}
                          startAngle={0}
                          endAngle={360}
                        >
                          <RadialBar
                            minAngle={15}
                            background
                            clockWise
                            dataKey="value"
                            cornerRadius={8}
                          >
                            {getQuarterlyChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={QUARTERLY_COLORS[index % QUARTERLY_COLORS.length]} />
                            ))}
                          </RadialBar>
                          <Legend
                            iconSize={10}
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                            formatter={(value, entry, index) => `${entry.payload.name}: ${formatGovCurrency(entry.payload.value)}`}
                          />
                          <RechartsTooltip
                            formatter={(value) => formatGovCurrency(value)}
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e5e7eb',
                              borderRadius: '0.375rem',
                              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                            }}
                          />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Alert className="bg-blue-50 border-blue-100">
                  <AlertTriangleIcon className="h-4 w-4" />
                  <AlertTitle>AI-Generated Budget Forecast</AlertTitle>
                  <AlertDescription>
                    This forecast is based on historical expenditure patterns, seasonal trends, and local government spending cycles. Use this for budget planning and resource allocation.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center space-y-4 bg-white rounded-lg shadow-sm p-6">
                <p>No barangay expenditure forecast available</p>
                <Button onClick={fetchForecastData} className="bg-blue-600 hover:bg-blue-700">
                  Generate Forecast
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Budget Utilization Tab */}
          <TabsContent value="budget" className="space-y-6 animate-in fade-in-50 duration-300">
            {isLoading.budget ? (
              <div className="space-y-6">
                <div className="flex justify-center py-8">
                  <div className="flex flex-col items-center">
                    <RefreshCw className="h-12 w-12 animate-spin mb-4" />
                    <p>Analyzing budget utilization...</p>
                  </div>
                </div>
                <Skeleton className="h-32 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-48 w-full" />
                </div>
              </div>
            ) : budgetAnalysis ? (
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        budgetAnalysis.performanceRating === "optimal_utilization" ? "bg-green-100" :
                        budgetAnalysis.performanceRating === "under_utilized" ? "bg-blue-100" : "bg-red-100"
                      }`}>
                        <BriefcaseIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">Fund Utilization Performance</h3>
                          {renderPerformanceBadge(budgetAnalysis.performanceRating)}
                        </div>
                        <p className="text-sm">
                          Utilization Rate: {budgetAnalysis.utilizationRate}
                        </p>
                      </div>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm" onClick={fetchBudgetAnalysis} className="self-start">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Update Analysis
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Refresh budget utilization analysis</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <Alert className="mt-6 bg-gray-50 border-gray-200">
                    <AlertTriangleIcon className="h-4 w-4" />
                    <AlertTitle>Performance Assessment</AlertTitle>
                    <AlertDescription>
                      {budgetAnalysis.analysis}
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="shadow-sm hover:shadow-md transition-all bg-white border-blue-100">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangleIcon className="h-5 w-5" />
                        <CardTitle className="text-base font-medium">Priority Focus Areas</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {budgetAnalysis.priorityAreas.map((area, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="min-w-5 pt-0.5">
                              <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center">
                                <span className="text-xs font-medium">{index + 1}</span>
                              </div>
                            </div>
                            <span className="text-sm">{area}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm hover:shadow-md transition-all bg-white border-blue-100">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <LightbulbIcon className="h-5 w-5" />
                        <CardTitle className="text-base font-medium">Recommendations</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {budgetAnalysis.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="min-w-5 pt-0.5">
                              <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center">
                                <span className="text-xs font-medium">{index + 1}</span>
                              </div>
                            </div>
                            <span className="text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center space-y-4 bg-white rounded-lg shadow-sm p-6">
                <p>No budget utilization analysis available</p>
                <Button onClick={fetchBudgetAnalysis} className="bg-blue-600 hover:bg-blue-700">
                  Generate Analysis
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-blue-50 text-xs py-3 px-6 rounded-b-lg">
        <div className="w-full flex justify-between items-center">
          <span>Powered by AI insights based on barangay financial data</span>
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </CardFooter>
    </Card>
  );
} 