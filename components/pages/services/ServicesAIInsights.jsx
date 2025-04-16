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
import { ArrowUpIcon, ArrowDownIcon, ArrowRightIcon, RefreshCw, BrainCircuit, TrendingUpIcon, TrendingDownIcon, BellIcon, AlertTriangleIcon, LightbulbIcon, ClockIcon, UsersIcon } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, BarChart, Bar, Cell, PieChart, Pie, Area, AreaChart, RadialBar, RadialBarChart } from 'recharts';
import { analyzeServicePatterns, forecastServiceDemand, analyzeServiceEfficiency } from "@/app/(app)/dashboard/services/actions";

// Modern color palette for charts
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
const SERVICE_COLORS = ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];
const TREND_UP_COLOR = '#10B981';
const TREND_DOWN_COLOR = '#EF4444';
const TREND_STABLE_COLOR = '#F59E0B';

export default function ServicesAIInsights() {
  const [activeTab, setActiveTab] = useState("patterns");
  const [patternAnalysis, setPatternAnalysis] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [efficiencyAnalysis, setEfficiencyAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState({
    patterns: false,
    forecast: false,
    efficiency: false
  });

  // Fetch analysis data based on active tab
  useEffect(() => {
    if (activeTab === "patterns" && !patternAnalysis) {
      fetchPatternAnalysis();
    } else if (activeTab === "forecast" && !forecastData) {
      fetchForecastData();
    } else if (activeTab === "efficiency" && !efficiencyAnalysis) {
      fetchEfficiencyAnalysis();
    }
  }, [activeTab]);

  // Function to fetch request pattern analysis
  async function fetchPatternAnalysis() {
    setIsLoading(prev => ({ ...prev, patterns: true }));
    try {
      const data = await analyzeServicePatterns({});
      setPatternAnalysis(data);
    } catch (error) {
      console.error("Failed to fetch pattern analysis:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, patterns: false }));
    }
  }

  // Function to fetch forecast data
  async function fetchForecastData() {
    setIsLoading(prev => ({ ...prev, forecast: true }));
    try {
      const data = await forecastServiceDemand({});
      setForecastData(data);
    } catch (error) {
      console.error("Failed to fetch forecast data:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, forecast: false }));
    }
  }

  // Function to fetch efficiency analysis
  async function fetchEfficiencyAnalysis() {
    setIsLoading(prev => ({ ...prev, efficiency: true }));
    try {
      const data = await analyzeServiceEfficiency({});
      setEfficiencyAnalysis(data);
    } catch (error) {
      console.error("Failed to fetch efficiency analysis:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, efficiency: false }));
    }
  }

  // Generate forecast chart data
  function getForecastChartData() {
    if (!forecastData?.predictions || !forecastData.predictions.length) return [];
    
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    
    // Create historical data (dummy for now)
    const historicalData = months.slice(0, currentMonth + 1).map((month, index) => ({
      month,
      value: Math.floor(Math.random() * 100) + 50,
      type: "historical"
    }));
    
    // Map predictions to chart data
    const futureData = forecastData.predictions.map((value, index) => ({
      month: months[(currentMonth + 1 + index) % 12],
      value,
      type: "forecast"
    }));
    
    return [...historicalData, ...futureData];
  }

  // Generate service type projection chart data
  function getServiceTypeChartData() {
    if (!forecastData?.serviceTypeProjections) return [];
    
    return [
      { name: 'Business Permit', value: forecastData.serviceTypeProjections.business_permit },
      { name: 'Barangay Clearance', value: forecastData.serviceTypeProjections.barangay_clearance },
      { name: 'Certificate of Indigency', value: forecastData.serviceTypeProjections.certificate_of_indigency },
      { name: 'Community Tax', value: forecastData.serviceTypeProjections.community_tax },
      { name: 'Residency', value: forecastData.serviceTypeProjections.residency }
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

  // Render performance badge for efficiency analysis
  function renderPerformanceBadge(performance) {
    if (performance === "needs_improvement") {
      return <Badge className="bg-amber-50 border-amber-200 hover:bg-amber-100">Needs Improvement</Badge>;
    } else if (performance === "below_target") {
      return <Badge className="bg-red-50 border-red-200 hover:bg-red-100">Below Target</Badge>;
    } else {
      return <Badge className="bg-green-50 border-green-200 hover:bg-green-100">Meeting Targets</Badge>;
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
              <CardTitle className="text-xl font-semibold">AI Service Insights</CardTitle>
              <CardDescription>
                AI-powered analysis for service optimization and planning
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
                    if (activeTab === "patterns") fetchPatternAnalysis();
                    if (activeTab === "forecast") fetchForecastData();
                    if (activeTab === "efficiency") fetchEfficiencyAnalysis();
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
        <Tabs defaultValue="patterns" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-blue-100/50 p-1">
            <TabsTrigger 
              value="patterns" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <div className="flex items-center gap-2">
                <TrendingUpIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Request Patterns</span>
                <span className="sm:hidden">Patterns</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="forecast" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <div className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Demand Forecast</span>
                <span className="sm:hidden">Forecast</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="efficiency" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Service Efficiency</span>
                <span className="sm:hidden">Efficiency</span>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Request Patterns Analysis Tab */}
          <TabsContent value="patterns" className="space-y-6 animate-in fade-in-50 duration-300">
            {isLoading.patterns ? (
              <div className="space-y-6">
                <div className="flex justify-center py-8">
                  <div className="flex flex-col items-center">
                    <RefreshCw className="h-12 w-12 animate-spin mb-4" />
                    <p>Analyzing service request patterns...</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </div>
            ) : patternAnalysis ? (
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-full" style={{ backgroundColor: getTrendColor(patternAnalysis.trend) + '20' }}>
                        {renderTrendIcon(patternAnalysis.trend)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {patternAnalysis.trend.charAt(0).toUpperCase() + patternAnalysis.trend.slice(1)} Request Trend
                        </h3>
                        <p className="text-sm">
                          Change of {patternAnalysis.percentageChange} from previous period
                        </p>
                      </div>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm" onClick={fetchPatternAnalysis} className="self-start">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Update Analysis
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Refresh analysis with latest service data</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <Alert className="bg-blue-50 border-blue-200">
                      <AlertTriangleIcon className="h-4 w-4" />
                      <AlertTitle>Request Pattern Analysis</AlertTitle>
                      <AlertDescription>
                        {patternAnalysis.analysis}
                      </AlertDescription>
                    </Alert>
                    
                    <Alert className="bg-indigo-50 border-indigo-200">
                      <AlertTriangleIcon className="h-4 w-4" />
                      <AlertTitle>Service Impact Assessment</AlertTitle>
                      <AlertDescription>
                        {patternAnalysis.impactAssessment}
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
                        {patternAnalysis.insights.map((insight, index) => (
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
                        {patternAnalysis.recommendations.map((rec, index) => (
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
                <p>No service pattern analysis available</p>
                <Button onClick={fetchPatternAnalysis} className="bg-blue-600 hover:bg-blue-700">
                  Generate Analysis
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Demand Forecast Tab */}
          <TabsContent value="forecast" className="space-y-6 animate-in fade-in-50 duration-300">
            {isLoading.forecast ? (
              <div className="space-y-6">
                <div className="flex justify-center py-8">
                  <div className="flex flex-col items-center">
                    <RefreshCw className="h-12 w-12 animate-spin mb-4" />
                    <p>Generating service demand forecasts...</p>
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
                      <h3 className="text-lg font-semibold">Service Request Forecast</h3>
                      <p className="text-sm">Projected service request volume for upcoming months</p>
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
                          <p>Regenerate the service request forecast</p>
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
                          width={40}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12 }}
                        />
                        <RechartsTooltip 
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
                        <CardTitle className="text-base font-medium">Projected Requests by Service Type</CardTitle>
                        <CardDescription>Expected service requests for the next quarter</CardDescription>
                      </div>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <BellIcon className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Service Type Projections</h4>
                            <p className="text-sm">
                              AI model projects service requests by analyzing historical patterns, seasonal factors, and community growth metrics.
                            </p>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={getServiceTypeChartData()} 
                          margin={{ left: 30, right: 10, bottom: 20, top: 10 }}
                          barCategoryGap="15%"
                          layout="vertical"
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
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e5e7eb',
                              borderRadius: '0.375rem',
                              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Bar 
                            dataKey="value" 
                            name="Projected Requests"
                            radius={[0, 4, 4, 0]}
                          >
                            {getServiceTypeChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={SERVICE_COLORS[index % SERVICE_COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Alert className="bg-blue-50 border-blue-100">
                  <AlertTriangleIcon className="h-4 w-4" />
                  <AlertTitle>AI-Generated Service Forecast</AlertTitle>
                  <AlertDescription>
                    This forecast is based on historical request patterns, seasonal trends, and local population data. Use this for staff allocation and resource planning.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center space-y-4 bg-white rounded-lg shadow-sm p-6">
                <p>No service demand forecast available</p>
                <Button onClick={fetchForecastData} className="bg-blue-600 hover:bg-blue-700">
                  Generate Forecast
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Service Efficiency Tab */}
          <TabsContent value="efficiency" className="space-y-6 animate-in fade-in-50 duration-300">
            {isLoading.efficiency ? (
              <div className="space-y-6">
                <div className="flex justify-center py-8">
                  <div className="flex flex-col items-center">
                    <RefreshCw className="h-12 w-12 animate-spin mb-4" />
                    <p>Analyzing service efficiency...</p>
                  </div>
                </div>
                <Skeleton className="h-32 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-48 w-full" />
                </div>
              </div>
            ) : efficiencyAnalysis ? (
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        efficiencyAnalysis.performanceRating === "meeting_targets" ? "bg-green-100" :
                        efficiencyAnalysis.performanceRating === "needs_improvement" ? "bg-amber-100" : "bg-red-100"
                      }`}>
                        <ClockIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">Service Efficiency Performance</h3>
                          {renderPerformanceBadge(efficiencyAnalysis.performanceRating)}
                        </div>
                        <p className="text-sm">
                          Efficiency Rate: {efficiencyAnalysis.efficiencyRate}
                        </p>
                      </div>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm" onClick={fetchEfficiencyAnalysis} className="self-start">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Update Analysis
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Refresh service efficiency analysis</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <Alert className="mt-6 bg-gray-50 border-gray-200">
                    <AlertTriangleIcon className="h-4 w-4" />
                    <AlertTitle>Performance Assessment</AlertTitle>
                    <AlertDescription>
                      {efficiencyAnalysis.analysis}
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="shadow-sm hover:shadow-md transition-all bg-white border-blue-100">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangleIcon className="h-5 w-5" />
                        <CardTitle className="text-base font-medium">Processing Bottlenecks</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {efficiencyAnalysis.bottlenecks.map((area, index) => (
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
                        <CardTitle className="text-base font-medium">Optimization Recommendations</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {efficiencyAnalysis.recommendations.map((rec, index) => (
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
                <p>No service efficiency analysis available</p>
                <Button onClick={fetchEfficiencyAnalysis} className="bg-blue-600 hover:bg-blue-700">
                  Generate Analysis
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-blue-50 text-xs py-3 px-6 rounded-b-lg">
        <div className="w-full flex justify-between items-center">
          <span>Powered by AI insights based on barangay service data</span>
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </CardFooter>
    </Card>
  );
} 