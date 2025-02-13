import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { FileText, X } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import Image from "next/image";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export function DocumentPreviewDialog({ document, isOpen, onClose }) {
  const isImage = document?.mimeType?.startsWith("image/");
  const isPDF = document?.mimeType === "application/pdf";
  const isVideo = document?.mimeType?.startsWith("video/");

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true); // Add loading state

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoading(false); // Set loading to false when PDF is loaded
  }

  const [scale, setScale] = useState(2.0); // Add scale state for zoom

  function PdfNav(){
    return (
      <>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
            disabled={pageNumber <= 1}
          >
            Previous
          </Button>
          <p>
            Page {pageNumber} of {numPages}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
            disabled={pageNumber >= numPages}
          >
            Next
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale(scale + 0.1)}
          >
            Zoom In
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale(Math.max(0.1, scale - 0.1))}
          >
            Zoom Out
          </Button>
          </div>
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle className="sr-only">Document Preview</DialogTitle>
      <DialogContent className="max-w-4xl w-full p-0 gap-0 bg-white/95 backdrop-blur-sm" aria-describedby={undefined}>
        <div className="sticky top-0 flex items-center justify-between p-4 border-b bg-white/50 backdrop-blur-sm">
          <h2 className="text-lg font-medium text-gray-900">
            {document.filename}
          </h2>
        </div>

        <div className="p-6 overflow-auto max-h-[85vh]">
          <div className="flex flex-col items-center gap-4">
            {isImage && (
              <img
                src={document.url}
                alt={document.filename}
                className="max-h-[70vh] object-contain rounded-lg"
              />
            )}

            {isPDF && (
              <>
                {loading && <p>Loading PDF...</p>}
                <PdfNav />
                <Document
                  file={document.url}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={(error) =>
                    console.error("PDF Load Error:", error)
                  }
                  className="min-w-[400] rounded-lg"
                >
                  <Page pageNumber={pageNumber} scale={scale} width={400} />
                </Document>
                <PdfNav />
              </>
            )}

            {isVideo && (
              <video
                src={document.url}
                controls
                className="max-h-[70vh] rounded-lg"
              />
            )}

            {!isImage && !isPDF && !isVideo && (
              <div className="flex flex-col items-center gap-3 py-12">
                <FileText className="w-16 h-16 text-gray-400" />
                <p className="text-gray-600">
                  This file type cannot be previewed
                </p>
                <a
                  href={document.url}
                  download={document.filename}
                  className="mt-2 text-sm text-gray-900 hover:text-gray-600 transition-colors"
                >
                  Download instead
                </a>
              </div>
            )}

            {document.notes && (
              <p className="text-sm text-gray-600 text-center mt-4">
                {document.notes}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
