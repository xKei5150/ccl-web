'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { generateMockDataAction } from "@/lib/actions/generate-mock-data"
import { Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Slider } from "@/components/ui/slider"

export default function GenerateMockDataButton() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [errorDetails, setErrorDetails] = useState(null)
  const [recoveryOption, setRecoveryOption] = useState(null)
  const [recordCount, setRecordCount] = useState(5)

  async function handleGenerateMockData() {
    try {
      setIsLoading(true)
      
      // Show initial toast for feedback
      const loadingToast = toast({
        title: "Generating Data",
        description: `This may take 1-2 minutes while Gemini AI generates ${recordCount} Filipino mock records...`,
        duration: 30000, // 30 seconds
      })
      
      const result = await generateMockDataAction(recordCount)
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Mock data generated successfully",
          variant: "success",
        })
      } else {
        setErrorDetails(result.errorDetail || result.error)
        setRecoveryOption(result.recovery)
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to generate mock data: ${error.message}`,
      })
      
      // If we have detailed error info, show dialog button
      if (errorDetails) {
        setIsDialogOpen(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <label htmlFor="records-slider" className="text-sm font-medium">
            Number of records per collection
          </label>
          <span className="text-sm font-semibold">{recordCount}</span>
        </div>
        <Slider
          id="records-slider"
          defaultValue={[recordCount]}
          max={50}
          min={5}
          step={5}
          onValueChange={(values) => setRecordCount(values[0])}
          disabled={isLoading}
          className="py-1"
        />
        <p className="text-xs text-muted-foreground">
          For faster generation or to troubleshoot errors, try using fewer records
        </p>
      </div>

      <Button 
        onClick={handleGenerateMockData}
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Data...
          </>
        ) : (
          "Generate Filipino Mock Data"
        )}
      </Button>
      
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error Details</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="max-h-[300px] overflow-auto p-2 bg-slate-50 rounded border text-xs font-mono mb-4">
                {errorDetails}
              </div>

              {recoveryOption && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-sm">
                  <strong>Recovery suggestion:</strong> {recoveryOption}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsDialogOpen(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}