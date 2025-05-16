"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Download } from "lucide-react";
import { exportFinancingToSpreadsheet } from "@/app/(app)/dashboard/financing/actions";

export default function ExportButton({ recordId, variant = "outline", className }) {
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
      
      const result = await exportFinancingToSpreadsheet(recordId); // Pass recordId if exporting a single record
      
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
          description: "Financing data has been exported to CSV",
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

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleExport}
      disabled={isExporting}
      className={className}
    >
      <Download className="h-4 w-4 mr-2" />
      {isExporting ? "Exporting..." : recordId ? "Export to CSV" : "Export All to CSV"}
    </Button>
  );
} 