import React, { useState, useEffect } from 'react';
import { File, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const ImagePreview = ({ url, fileName, className }) => (
  <div className={className.container}>
    <img
      src={url}
      alt={fileName}
      className={className.content}
    />
  </div>
);

const VideoPreview = ({ url, className }) => (
  <video
    src={url}
    controls
    className={className}
  />
);

const PDFPreview = ({ url, isDialog }) => 
  isDialog ? (
    <iframe
      src={url}
      className="w-full h-[80vh]"
      title="PDF preview"
    />
  ) : (
    <DefaultFilePreview icon={FileText} label="PDF Document" />
  );

const DefaultFilePreview = ({ icon: Icon, label }) => (
  <div className="h-48 flex flex-col items-center justify-center gap-2 text-muted-foreground">
    <Icon className="h-20 w-20" />
    <span className="text-sm">{label}</span>
  </div>
);

const PreviewContent = ({ file, url, isDialog }) => {
  const fileType = file.type.split('/')[0];
  const className = {
    content: isDialog ? "max-h-[80vh] w-auto" : "w-full h-48 object-contain",
    container: isDialog ? "flex justify-center" : "relative w-full h-48"
  };

  switch (fileType) {
    case 'image':
      return <ImagePreview url={url} fileName={file.name} className={className} />;
    case 'video':
      return <VideoPreview url={url} className={className.content} />;
    case 'application':
      if (file.type === 'application/pdf') {
        return <PDFPreview url={url} isDialog={isDialog} />;
      }
    default:
      return <DefaultFilePreview icon={File} label="File" />;
  }
};

export const FilePreview = ({ file }) => {
  const [showPreview, setShowPreview] = useState(false);
  const url = URL.createObjectURL(file);
  console.log('file', file);
  useEffect(() => {
    return () => URL.revokeObjectURL(url);
  }, [url]);

  return (
    <>
      <div 
        className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setShowPreview(true)}
      >
        <PreviewContent file={file} url={url} isDialog={false} />
        <div className="mt-2 text-sm text-gray-500 truncate">
          {file.name}
        </div>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogTitle className="sr-only">Document Preview</DialogTitle>
        <DialogContent className="max-w-4xl w-full" aria-describedby={undefined}>
          <div className="flex flex-col gap-4">
            <PreviewContent file={file} url={url} isDialog={true} />
            <div className="text-sm text-gray-500">
              {file.name}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};