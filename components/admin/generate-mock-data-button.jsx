'use client'

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { generateMockDataAction } from "@/lib/actions/generate-mock-data"

export default function GenerateMockDataButton() {
  const { toast } = useToast()

  async function handleGenerateMockData() {
    try {
      const result = await generateMockDataAction()
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Mock data generated successfully",
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to generate mock data: ${error.message}`,
      })
    }
  }

  return (
    <Button 
      onClick={handleGenerateMockData}
      className="w-full md:w-auto"
    >
      Generate Mock Data
    </Button>
  )
}