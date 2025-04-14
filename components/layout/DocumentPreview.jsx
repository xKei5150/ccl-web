"use client";

import { FileText, Image as ImageIcon, Video, File } from "lucide-react";
import { useState } from "react";
import { DocumentPreviewDialog } from "./DocumentPreviewDialog";
import { cn } from "@/lib/utils";

export default function DocumentPreview({ document = {}, className = "" }) {
  const [showPreview, setShowPreview] = useState(false);
  
  // Ensure document is an object
  if (!document || typeof document !== 'object') {
    document = {};
  }
  
  const isImage = document.mimeType?.startsWith('image/');
  const isPDF = document.mimeType === 'application/pdf';
  const isVideo = document.mimeType?.startsWith('video/');
  const isPreviewable = isImage || isPDF || isVideo;

  const getIcon = () => {
    if (isImage) return <ImageIcon className="w-6 h-6 text-blue-500" />;
    if (isPDF) return <FileText className="w-6 h-6 text-red-500" />;
    if (isVideo) return <Video className="w-6 h-6 text-purple-500" />;
    return <File className="w-6 h-6 text-gray-500" />;
  };

  // If there's no document or URL, show a placeholder
  if (!document.url && !document.filename && !document.alt) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-1 p-2 text-center">
          <File className="w-6 h-6 text-gray-400" />
          <span className="text-xs text-gray-400">No file</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        className={cn(
          "group relative bg-white rounded-lg transition-all duration-300 h-full w-full",
          isPreviewable && "cursor-pointer"
        )}
        onClick={() => isPreviewable && setShowPreview(true)}
      >
        <div className="flex flex-col items-center justify-center h-full">
          {isImage ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={document.url}
                alt={document.filename || document.alt || "Image"}
                className="object-contain max-h-full max-w-full"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <div className="flex flex-col items-center gap-1 p-2 text-center">
                {getIcon()}
                <span className="text-xs text-gray-600 mt-1 line-clamp-1 max-w-full px-2">
                  {document.filename || document.alt || "File"}
                </span>
              </div>
            </div>
          )}

          {isPreviewable && (
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <span className="bg-white/90 px-2 py-1 rounded-full text-xs font-medium text-gray-900">
                Preview
              </span>
            </div>
          )}
        </div>
      </div>

      {isPreviewable && (
        <DocumentPreviewDialog
          document={document}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}