"use client";

import { FileText, Image as ImageIcon, Video, File } from "lucide-react";
import { useState } from "react";
import { DocumentPreviewDialog } from "./DocumentPreviewDialog";

export default function DocumentPreview({ document }) {
  const [showPreview, setShowPreview] = useState(false);
  const isImage = document.mimeType?.startsWith('image/');
  const isPDF = document.mimeType === 'application/pdf';
  const isVideo = document.mimeType?.startsWith('video/');
  const isPreviewable = isImage || isPDF || isVideo;
  return (
    <>
      <div 
        className={`flex flex-col items-center gap-2 p-2 border rounded ${
          isPreviewable ? 'cursor-pointer hover:bg-gray-50' : ''
        }`}
        onClick={() => isPreviewable && setShowPreview(true)}
      >
        {isImage && (
          <div className="relative w-32 h-32">
            <img
              src={document.url}
              alt={document.filename}
              className="object-cover w-full h-full rounded"
            />
          </div>
        )}

        {isPDF && (
          <div className="flex flex-col items-center">
            <FileText className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {isVideo && (
          <video
            src={document.url}
            className="w-32 h-32 object-cover rounded"
          />
        )}

        {!isImage && !isPDF && !isVideo && (
          <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded">
            <File className="w-12 h-12 text-gray-400" />
          </div>
        )}

        <div className="flex items-center gap-2 text-sm">
          {isImage && <ImageIcon className="w-4 h-4" />}
          {isPDF && <FileText className="w-4 h-4" />}
          {isVideo && <Video className="w-4 h-4" />}
          {!isImage && !isPDF && !isVideo && <File className="w-4 h-4" />}
          <span className="truncate max-w-[120px]" title={document.filename}>
            {document.filename}
          </span>
        </div>
        {document.notes && (
          <span className="text-xs text-gray-500 truncate max-w-[120px]" title={document.notes}>
            {document.notes}
          </span>
        )}
      </div>

      <DocumentPreviewDialog
        document={document}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </>
  );
} 