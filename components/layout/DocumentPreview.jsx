"use client";

import { FileText, Image as ImageIcon, Video, File } from "lucide-react";
import { useState } from "react";
import { DocumentPreviewDialog } from "./DocumentPreviewDialog";
import { cn } from "@/lib/utils";

export default function DocumentPreview({ document }) {
  const [showPreview, setShowPreview] = useState(false);
  const isImage = document.mimeType?.startsWith('image/');
  const isPDF = document.mimeType === 'application/pdf';
  const isVideo = document.mimeType?.startsWith('video/');
  const isPreviewable = isImage || isPDF || isVideo;

  const getIcon = () => {
    if (isImage) return <ImageIcon className="w-8 h-8 text-blue-500" />;
    if (isPDF) return <FileText className="w-8 h-8 text-red-500" />;
    if (isVideo) return <Video className="w-8 h-8 text-purple-500" />;
    return <File className="w-8 h-8 text-gray-500" />;
  };

  return (
    <>
      <div 
        className={cn(
          "group relative bg-white p-4 rounded-lg border border-gray-100 transition-all duration-300",
          isPreviewable && "cursor-pointer hover:shadow-md hover:border-gray-200"
        )}
        onClick={() => isPreviewable && setShowPreview(true)}
      >
        <div className="flex flex-col items-center gap-3">
          {isImage ? (
            <div className="relative w-full pt-[100%]">
              <img
                src={document.url}
                alt={document.filename}
                className="absolute inset-0 w-50% h-50% object-cover rounded-md"
              />
            </div>
          ) : (
            <div className="w-full pt-[100%] relative bg-gray-50 rounded-md">
              <div className="absolute inset-0 flex items-center justify-center">
                {getIcon()}
              </div>
            </div>
          )}

          <div className="w-full">
            <div className="flex items-center gap-2 text-sm text-gray-900">
              <span className="truncate" title={document.filename}>
                {document.filename}
              </span>
            </div>
            {document.notes && (
              <p className="text-xs text-gray-500 mt-1 truncate" title={document.notes}>
                {document.notes}
              </p>
            )}
          </div>

          {isPreviewable && (
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <span className="bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-gray-900">
                Preview
              </span>
            </div>
          )}
        </div>
      </div>

      <DocumentPreviewDialog
        document={document}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </>
  );
}