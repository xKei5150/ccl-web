"use client";
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Upload, Trash, X } from 'lucide-react';
import { FilePreview } from '@/components/ui/file-preview';
import DocumentPreview from '@/components/layout/DocumentPreview';

// Helper function to check if object is a File
const isFileObject = (obj) => {
  return obj && 
    typeof obj === 'object' && 
    'name' in obj && 
    'type' in obj &&
    typeof obj.type === 'string' &&
    typeof obj.name === 'string';
};

// Helper to determine if the value is a PayloadCMS document
const isPayloadDocument = (obj) => {
  return obj && 
    typeof obj === 'object' && 
    (obj.id || obj.filename || obj.mimeType);
};

export const FileUpload = ({ 
  onFileSelect, 
  value, 
  accept, 
  onRemove = () => {},
  previewSize = "default" // Can be "small", "medium", or "default"
}) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false
  });

  const getPreviewSizeClasses = () => {
    switch(previewSize) {
      case "small":
        return "h-24"; // Small preview
      case "medium":
        return "h-36"; // Medium preview
      default:
        return "h-48"; // Default size
    }
  };

  return (
    <div className="space-y-4">
      {!value && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-4 transition-colors",
            isDragActive ? "border-primary bg-primary/10" : "border-border",
            "hover:border-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2 text-muted-foreground py-2">
            <Upload className="h-6 w-6" />
            {isDragActive ? (
              <p className="text-sm">Drop the file here</p>
            ) : (
              <p className="text-sm text-center">
                Drag & drop a file here, or click to select
              </p>
            )}
          </div>
        </div>
      )}

      {value && (
        <div className="relative bg-muted/20 rounded-lg overflow-hidden border">
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 bg-background/80 text-destructive hover:text-destructive p-1 rounded-full hover:bg-background/90 z-10 transition-colors"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
          <div className={cn(
            "overflow-hidden",
            getPreviewSizeClasses()
          )}>
            {Array.isArray(value) ? (
              isFileObject(value[0]) && typeof value[0].arrayBuffer === 'function' ? (
                <FilePreview file={value[0]} previewSize={previewSize} />
              ) : (
                <DocumentPreview document={value[0] || {}} className={getPreviewSizeClasses()} />
              )
            ) : (
              isFileObject(value) && typeof value.arrayBuffer === 'function' ? (
                <FilePreview file={value} previewSize={previewSize} />
              ) : (
                <DocumentPreview document={value || {}} className={getPreviewSizeClasses()} />
              )
            )}
          </div>
          <div className="text-xs text-muted-foreground truncate p-2 bg-muted/30">
            {Array.isArray(value) 
              ? (value[0]?.name || value[0]?.filename || "Selected file") 
              : (value?.name || value?.filename || "Selected file")
            }
          </div>
        </div>
      )}
    </div>
  );
};