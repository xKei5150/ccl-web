import React, { useState, useEffect } from 'react';
import { File, FileText, Image as ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const ImagePreview = ({ url, fileName, className, onClick }) => (
  <div className={className.container} onClick={onClick}>
    <img
      src={url}
      alt={fileName || "Preview"}
      className={className.content}
    />
  </div>
);

const VideoPreview = ({ url, className, onClick }) => (
  <div onClick={onClick}>
    <video
      src={url}
      controls
      className={className}
    />
  </div>
);

const PDFPreview = ({ url, isDialog, onClick }) => 
  isDialog ? (
    <iframe
      src={url}
      className="w-full h-[80vh]"
      title="PDF preview"
    />
  ) : (
    <div onClick={onClick}>
      <DefaultFilePreview icon={FileText} label="PDF Document" />
    </div>
  );

const DefaultFilePreview = ({ icon: Icon, label, className, onClick }) => (
  <div 
    className={`flex flex-col items-center justify-center gap-2 text-muted-foreground ${className || "h-full"}`}
    onClick={onClick}
  >
    <Icon className="h-12 w-12" />
    <span className="text-xs">{label}</span>
  </div>
);

// Helper function to check if object is a File
const isFileObject = (obj) => {
  return obj && 
    typeof obj === 'object' && 
    'name' in obj && 
    'type' in obj &&
    typeof obj.type === 'string' &&
    typeof obj.name === 'string';
};

const PreviewContent = ({ file, url, isDialog, previewSize, onClick }) => {
  const getClassName = () => {
    const base = {
      content: `object-contain ${isDialog ? "max-h-[80vh] w-auto" : "w-full"}`,
      container: isDialog ? "flex justify-center" : "relative w-full h-full flex items-center justify-center"
    };

    // Apply size-specific styles only when not in dialog
    if (!isDialog) {
      // Height already controlled by parent container
      base.content += " h-full";
    }

    return base;
  };

  const className = getClassName();
  
  // For files uploaded from PayloadCMS
  if (!file.type && file.mimeType) {
    file.type = file.mimeType;
  }
  
  if (!file.type) {
    return <DefaultFilePreview icon={File} label={file.name || file.filename || "File"} onClick={onClick} />;
  }
  
  const fileType = file.type.split('/')[0];

  switch (fileType) {
    case 'image':
      return <ImagePreview url={url} fileName={file.name || file.filename} className={className} onClick={onClick} />;
    case 'video':
      return <VideoPreview url={url} className={className.content} onClick={onClick} />;
    case 'application':
      if (file.type === 'application/pdf') {
        return <PDFPreview url={url} isDialog={isDialog} onClick={onClick} />;
      }
    default:
      return <DefaultFilePreview icon={File} label={file.name || file.filename || "File"} onClick={onClick} />;
  }
};

export const FilePreview = ({ file, previewSize }) => {
  const [showPreview, setShowPreview] = useState(false);
  
  // Handle URL creation based on file type
  let url;
  if (isFileObject(file) && typeof file.arrayBuffer === 'function') {
    // Browser File object
    url = URL.createObjectURL(file);
  } else if (file?.url) {
    // PayloadCMS file
    url = file.url;
  } else if (file?.filename && file?.sizes?.thumbnail?.url) {
    // PayloadCMS image with thumbnails
    url = file.sizes.thumbnail.url;
  }
  
  useEffect(() => {
    // Only revoke if we created an object URL
    if (isFileObject(file) && typeof file.arrayBuffer === 'function' && url) {
      return () => URL.revokeObjectURL(url);
    }
  }, [url, file]);

  if (!file) return null;

  const handlePreviewClick = () => {
    setShowPreview(true);
  };

  return (
    <>
      <div className="h-full w-full flex items-center justify-center">
        <PreviewContent 
          file={file} 
          url={url} 
          isDialog={false} 
          previewSize={previewSize}
          onClick={handlePreviewClick}
        />
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogTitle className="sr-only">File Preview</DialogTitle>
        <DialogContent className="max-w-4xl w-full" aria-describedby={undefined}>
          <div className="flex flex-col gap-4">
            <PreviewContent file={file} url={url} isDialog={true} />
            <div className="text-sm text-gray-500 flex justify-between">
              <span>{file.name || file.filename || ""}</span>
              {file.size && (
                <span>{Math.round(file.size / 1024)} KB</span>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};