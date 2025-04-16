import GenerateMockDataButton from "@/components/admin/generate-mock-data-button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsItem, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function AdminToolsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Tools</h1>
      
      <Tabs defaultValue="mock-data" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="mock-data">Mock Data</TabsTrigger>
          <TabsTrigger value="system" disabled>System</TabsTrigger>
          <TabsTrigger value="maintenance" disabled>Maintenance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mock-data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                AI-Powered Mock Data Generation
                <Badge className="ml-2 bg-green-600">Gemini AI</Badge>
              </CardTitle>
              <CardDescription>
                Leverages Google's Gemini AI to generate realistic Filipino mock data for all collections.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  Generates approximately 50 records per collection using context-aware Filipino data:
                </p>
                <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                  <li>Users with Filipino names and contact details</li>
                  <li>Personal information with proper Filipino addresses (including barangays)</li>
                  <li>Households with Filipino family structures</li>
                  <li>Businesses like sari-sari stores and carinderias</li>
                  <li>Reports and requests relevant to Filipino communities</li>
                  <li>Financing records with Filipino government context</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-4">
                  Note: This process may take 1-2 minutes as it makes multiple AI calls to generate structured data.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <GenerateMockDataButton />
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}