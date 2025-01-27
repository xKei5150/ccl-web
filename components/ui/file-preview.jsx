import React from 'react';
import { File, FileText, Image, Video } from 'lucide-react';

export const FilePreview = ({ file }) => {
  const fileType = file.type.split('/')[0];
  const url = URL.createObjectURL(file);

  const renderPreview = () => {
    switch (fileType) {
      case 'image':
        return (
          <div className="relative w-full h-48">
            <img
              src={url}
              alt={file.name}
              className="w-full h-full object-contain"
            />
          </div>
        );
      case 'video':
        return (
          <video
            src={url}
            controls
            className="w-full max-h-48"
          />
        );
      case 'application':
        if (file.type === 'application/pdf') {
          return (
            <iframe
              src={url}
              className="w-full h-48"
              title="PDF preview"
            />
          );
        }
      default:
        return (
          <div className="flex items-center gap-2 text-muted-foreground">
            <File className="h-8 w-8" />
            <span>{file.name}</span>
          </div>
        );
    }
  };

  React.useEffect(() => {
    return () => URL.revokeObjectURL(url);
  }, [url]);

  return (
    <div className="border rounded-lg p-4">
      {renderPreview()}
    </div>
  );
};