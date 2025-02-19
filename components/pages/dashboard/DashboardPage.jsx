import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {Tabs, TabsContent, TabsList} from "@/components/ui/tabs";
import useAIAnalysis from "@/hooks/useAIAnalysis";


import {TabsTrigger} from "../../ui/tabs";

export default function DashboardPage() {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
                <CardHeader className="px-0 pt-0">
                    <CardTitle>Barangay Management Overview</CardTitle>
                    <CardDescription>
                        Monthly activity trends with category-specific predictions
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                    <Chart data={data} />
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
                            <AIAnalysis type="requests" data={data} />
                        </TabsContent>
                        <TabsContent value="reports">
                            <AIAnalysis type="reports" data={data} />
                        </TabsContent>
                        <TabsContent value="records">
                            <AIAnalysis type="records" data={data} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};