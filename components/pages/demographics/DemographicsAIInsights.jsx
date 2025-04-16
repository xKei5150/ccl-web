"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RefreshCw, BrainCircuit, TrendingUpIcon, UsersIcon, HeartPulseIcon, LightbulbIcon } from "lucide-react";

export default function DemographicsAIInsights() {
  const [activeTab, setActiveTab] = useState("population");
  const [populationAnalysis, setPopulationAnalysis] = useState(null);
  const [ageAnalysis, setAgeAnalysis] = useState(null);
  const [healthAnalysis, setHealthAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState({
    population: false,
    age: false,
    health: false
  });

  // Placeholder fetch functions
  async function fetchPopulationAnalysis() {
    setIsLoading(prev => ({ ...prev, population: true }));
    setTimeout(() => {
      setPopulationAnalysis({
        trend: "upward",
        percentageChange: "+2.1%",
        analysis: "Population is steadily increasing year over year.",
        insights: [
          "Male to female ratio is balanced.",
          "Household size remains stable.",
          "Voter registration is increasing."
        ],
        recommendations: [
          "Plan for increased resource allocation.",
          "Monitor migration trends.",
          "Continue voter registration drives."
        ]
      });
      setIsLoading(prev => ({ ...prev, population: false }));
    }, 500);
  }
  async function fetchAgeAnalysis() {
    setIsLoading(prev => ({ ...prev, age: true }));
    setTimeout(() => {
      setAgeAnalysis({
        analysis: "Youth population (0-24) comprises 42% of total.",
        insights: [
          "Working-age group is the largest segment.",
          "Senior population is growing slowly.",
          "Dependency ratio is moderate."
        ],
        recommendations: [
          "Expand youth programs.",
          "Prepare for aging population needs.",
          "Support working-age employment."
        ]
      });
      setIsLoading(prev => ({ ...prev, age: false }));
    }, 500);
  }
  async function fetchHealthAnalysis() {
    setIsLoading(prev => ({ ...prev, health: true }));
    setTimeout(() => {
      setHealthAnalysis({
        analysis: "Hypertension and diabetes are the most common chronic diseases.",
        insights: [
          "Chronic disease prevalence is stable.",
          "Asthma cases are higher among youth.",
          "PWD count is consistent year to year."
        ],
        recommendations: [
          "Increase health screening programs.",
          "Promote healthy lifestyle campaigns.",
          "Support PWD accessibility initiatives."
        ]
      });
      setIsLoading(prev => ({ ...prev, health: false }));
    }, 500);
  }

  useEffect(() => {
    if (activeTab === "population" && !populationAnalysis) fetchPopulationAnalysis();
    if (activeTab === "age" && !ageAnalysis) fetchAgeAnalysis();
    if (activeTab === "health" && !healthAnalysis) fetchHealthAnalysis();
  }, [activeTab]);

  return (
    <Card className="w-full bg-gradient-to-br from-indigo-50/50 to-blue-50/50 border-blue-100 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-full">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">AI Demographic Insights</CardTitle>
              <CardDescription>
                AI-powered analysis for population, age, and health trends
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
                    if (activeTab === "population") fetchPopulationAnalysis();
                    if (activeTab === "age") fetchAgeAnalysis();
                    if (activeTab === "health") fetchHealthAnalysis();
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
        <Tabs defaultValue="population" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-blue-100/50 p-1">
            <TabsTrigger 
              value="population" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <div className="flex items-center gap-2">
                <TrendingUpIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Population Trends</span>
                <span className="sm:hidden">Population</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="age" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <div className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Age Structure</span>
                <span className="sm:hidden">Age</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="health" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <div className="flex items-center gap-2">
                <HeartPulseIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Health Insights</span>
                <span className="sm:hidden">Health</span>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Population Trends Tab */}
          <TabsContent value="population" className="space-y-6 animate-in fade-in-50 duration-300">
            {isLoading.population ? (
              <div className="space-y-6">
                <div className="flex justify-center py-8">
                  <div className="flex flex-col items-center">
                    <RefreshCw className="h-12 w-12 animate-spin mb-4" />
                    <p>Analyzing population trends...</p>
                  </div>
                </div>
                <Skeleton className="h-32 w-full" />
              </div>
            ) : populationAnalysis ? (
              <div className="space-y-6">
                <Alert>
                  <AlertTitle>Population Analysis</AlertTitle>
                  <AlertDescription>{populationAnalysis.analysis}</AlertDescription>
                </Alert>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Key Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {populationAnalysis.insights.map((insight, index) => (
                          <li key={index} className="text-sm">{insight}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {populationAnalysis.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm">{rec}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center space-y-4 bg-white rounded-lg shadow-sm p-6">
                <p>No population analysis available</p>
                <Button onClick={fetchPopulationAnalysis} className="bg-blue-600 hover:bg-blue-700">
                  Generate Analysis
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Age Structure Tab */}
          <TabsContent value="age" className="space-y-6 animate-in fade-in-50 duration-300">
            {isLoading.age ? (
              <div className="space-y-6">
                <div className="flex justify-center py-8">
                  <div className="flex flex-col items-center">
                    <RefreshCw className="h-12 w-12 animate-spin mb-4" />
                    <p>Analyzing age structure...</p>
                  </div>
                </div>
                <Skeleton className="h-32 w-full" />
              </div>
            ) : ageAnalysis ? (
              <div className="space-y-6">
                <Alert>
                  <AlertTitle>Age Structure Analysis</AlertTitle>
                  <AlertDescription>{ageAnalysis.analysis}</AlertDescription>
                </Alert>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Key Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {ageAnalysis.insights.map((insight, index) => (
                          <li key={index} className="text-sm">{insight}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {ageAnalysis.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm">{rec}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center space-y-4 bg-white rounded-lg shadow-sm p-6">
                <p>No age structure analysis available</p>
                <Button onClick={fetchAgeAnalysis} className="bg-blue-600 hover:bg-blue-700">
                  Generate Analysis
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Health Insights Tab */}
          <TabsContent value="health" className="space-y-6 animate-in fade-in-50 duration-300">
            {isLoading.health ? (
              <div className="space-y-6">
                <div className="flex justify-center py-8">
                  <div className="flex flex-col items-center">
                    <RefreshCw className="h-12 w-12 animate-spin mb-4" />
                    <p>Analyzing health profile...</p>
                  </div>
                </div>
                <Skeleton className="h-32 w-full" />
              </div>
            ) : healthAnalysis ? (
              <div className="space-y-6">
                <Alert>
                  <AlertTitle>Health Profile Analysis</AlertTitle>
                  <AlertDescription>{healthAnalysis.analysis}</AlertDescription>
                </Alert>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Key Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {healthAnalysis.insights.map((insight, index) => (
                          <li key={index} className="text-sm">{insight}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {healthAnalysis.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm">{rec}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center space-y-4 bg-white rounded-lg shadow-sm p-6">
                <p>No health profile analysis available</p>
                <Button onClick={fetchHealthAnalysis} className="bg-blue-600 hover:bg-blue-700">
                  Generate Analysis
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-blue-50 text-xs py-3 px-6 rounded-b-lg">
        <div className="w-full flex justify-between items-center">
          <span>Powered by AI insights based on barangay demographic data</span>
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </CardFooter>
    </Card>
  );
} 