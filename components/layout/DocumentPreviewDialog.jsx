import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FileText } from "lucide-react";


export function DocumentPreviewDialog({ document, isOpen, onClose }) {
  const isImage = document?.mimeType?.startsWith('image/');
  const isPDF = document?.mimeType === 'application/pdf';
  const isVideo = document?.mimeType?.startsWith('video/');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle className="sr-only">Document Preview</DialogTitle>
      <DialogContent className="max-w-4xl w-full" aria-describedby={undefined}  >
        <div className="flex flex-col items-center gap-4">
          {isImage && (
            <img
              src={document.url}
              alt={document.filename}
              className="max-h-[80vh] object-contain"
            />
          )}

          {isPDF && (
            <iframe
              src={document.url}
              className="w-full h-[80vh]"
              title={document.filename}
            />
          )}

          {isVideo && (
            <video
              src={document.url}
              controls
              className="max-h-[80vh]"
            />
          )}

          {!isImage && !isPDF && !isVideo && (
            <div className="flex flex-col items-center gap-2 p-8">
              <FileText className="w-16 h-16 text-gray-400" />
              <p>This file type cannot be previewed</p>
              <a 
                href={document.url} 
                download={document.filename}
                className="text-blue-500 hover:underline"
              >
                Download instead
              </a>
            </div>
          )}

          <div className="text-sm text-gray-500">
            {document.filename}
            {document.notes && (
              <p className="mt-1">{document.notes}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 