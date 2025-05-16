'use client';

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";

function PrintButton() {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Ensure component only runs on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    setIsLoading(true);
    try {
      // Dynamically import html2pdf.js only when needed (client-side)
      const html2pdf = (await import('html2pdf.js')).default;
      
      // Get the certificate container element
      const element = document.querySelector('.certificate-container') || document.body;
      
      const opt = {
        margin: 0,
        filename: 'barangay-certificate.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'in', 
          format: 'letter', 
          orientation: 'portrait'
        }
      };
      
      // Generate PDF
      html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to print dialog if PDF generation fails
      alert('PDF generation failed. Please use the Print button and save as PDF instead.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="fixed bottom-8 right-8 flex gap-3 print:hidden">
      <Button
        type="button"
        onClick={handleExportPDF}
        variant="secondary"
        className="flex gap-2 items-center bg-green-600 hover:bg-green-700 text-white"
        disabled={isLoading}
      >
        <Download size={16} /> 
        {isLoading ? 'Generating PDF...' : 'Save as PDF'}
      </Button>
      
      <Button
        type="button"
        onClick={handlePrint}
        className="flex gap-2 items-center bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Printer size={16} />
        Print
      </Button>
    </div>
  );
}

export { PrintButton };
