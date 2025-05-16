"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Download } from "lucide-react";
import { exportReportsData } from "@/app/(app)/dashboard/reports-stat/actions";

export default function ExportButton({ reportType = "overview", year = "", month = "", status = "all", variant = "outline", className }) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  // Function to trigger download by creating a temporary <a> element
  const triggerDownload = (data, filename, contentType) => {
    // Create a blob with the data
    const blob = new Blob([data], { type: contentType });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      const result = await exportReportsData({ reportType, year, month, status });
      
      if (result.error) {
        toast({
          title: "Export Failed",
          description: result.error,
          variant: "destructive",
        });
        return;
      }
      
      if (result.success) {
        // Trigger file download
        triggerDownload(result.data, result.filename, result.contentType);
        
        toast({
          title: "Export Successful",
          description: `Reports ${reportType} data has been exported to CSV`,
        });
      }
    } catch (error) {
      console.error("Error during export:", error);
      toast({
        title: "Export Failed",
        description: "An unexpected error occurred while exporting data",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const reportTypeLabel = {
    overview: "Overview",
    insights: "Insights",
    trends: "Trends Analysis"
  }[reportType] || "Data";

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleExport}
      disabled={isExporting}
      className={className}
    >
      <Download className="h-4 w-4 mr-2" />
      {isExporting ? "Exporting..." : `Export ${reportTypeLabel}`}
    </Button>
  );
} 