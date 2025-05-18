"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Download } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { exportFinanceData } from "@/app/(app)/dashboard/finance/actions";

export default function ExportButton({ analysisType = "trends", variant = "outline", className }) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  const { isAdmin, isStaff } = useAuth();
  const hasAdminAccess = isAdmin || isStaff;

  // If user doesn't have admin access, don't render the button
  if (!hasAdminAccess) {
    return null;
  }

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
      
      const result = await exportFinanceData({ analysisType });
      
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
          description: `Finance ${analysisType} data has been exported to CSV`,
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

  const analysisTypeLabel = {
    trends: "Trends",
    forecast: "Forecast",
    budget: "Budget Performance"
  }[analysisType] || "Analysis";

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleExport}
      disabled={isExporting}
      className={className}
    >
      <Download className="h-4 w-4 mr-2" />
      {isExporting ? "Exporting..." : `Export ${analysisTypeLabel}`}
    </Button>
  );
} 