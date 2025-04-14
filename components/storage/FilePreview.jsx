"use client";

import { useState } from "react";
import { FileText, Image as ImageIcon, Video, File, Music } from "lucide-react";
import { DocumentPreviewDialog } from "../layout/DocumentPreviewDialog";
import { cn } from "@/lib/utils";

export function FilePreview({ file }) {
  const [showPreview, setShowPreview] = useState(false);
  
  // Determine file type from mimetype or type
  const mimeType = file.mimeType || file.type || "";
  const fileName = file.filename || file.name || "File";
  const fileUrl = file.url || file.fileURL || "";
  
  const isImage = mimeType.startsWith('image/');
  const isPDF = mimeType === 'application/pdf' || fileName.endsWith('.pdf');
  const isVideo = mimeType.startsWith('video/');
  const isAudio = mimeType.startsWith('audio/');
  const isPreviewable = isImage || isPDF || isVideo;

  // Format the document object to match what DocumentPreviewDialog expects
  const documentObj = {
    filename: fileName,
    url: fileUrl,
    mimeType: mimeType,
  };

  const getIcon = () => {
    if (isImage) return <ImageIcon className="w-8 h-8 text-blue-500" />;
    if (isPDF) return <FileText className="w-8 h-8 text-red-500" />;
    if (isVideo) return <Video className="w-8 h-8 text-purple-500" />;
    if (isAudio) return <Music className="w-8 h-8 text-green-500" />;
    return <File className="w-8 h-8 text-gray-500" />;
  };

  return (
    <>
      <div 
        className={cn(
          "group relative bg-white rounded-lg border border-gray-100 transition-all duration-300 h-full",
          isPreviewable && "cursor-pointer hover:shadow-md hover:border-gray-200"
        )}
        onClick={() => isPreviewable && setShowPreview(true)}
      >
        {isImage ? (
          <div className="w-full h-full">
            <img
              src={fileUrl}
              alt={fileName}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-md">
            {getIcon()}
          </div>
        )}

        {isPreviewable && (
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <span className="bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-gray-900">
              Preview
            </span>
          </div>
        )}
      </div>

      {isPreviewable && (
        <DocumentPreviewDialog
          document={documentObj}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}