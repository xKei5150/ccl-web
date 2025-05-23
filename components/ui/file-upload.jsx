"use client";
import React, { useCallback, useEffect, useState } from 'react';
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
    (obj.id || obj.filename || obj.mimeType || 
     // Handle string IDs that reference documents
     (typeof obj === 'string' && obj.length > 0));
};

export const FileUpload = ({ 
  onFileSelect, 
  value, 
  accept, 
  onRemove = () => {},
  previewSize = "default" // Can be "small", "medium", or "default"
}) => {
  const [internalValue, setInternalValue] = useState(value);

  // Update internal value when prop changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const newValue = acceptedFiles;
      setInternalValue(newValue);
      onFileSelect(newValue);
    }
  }, [onFileSelect]);

  const handleRemove = () => {
    setInternalValue(null);
    onRemove();
  };

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

  // Check if we have a document to display
  const hasDocument = !!internalValue && (
    isFileObject(internalValue) || 
    isPayloadDocument(internalValue) || 
    (Array.isArray(internalValue) && internalValue.length > 0) ||
    typeof internalValue === 'string'
  );

  return (
    <div className="space-y-4">
      {!hasDocument && (
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

      {hasDocument && (
        <div className="relative bg-muted/20 rounded-lg overflow-hidden border">
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-background/80 text-destructive hover:text-destructive p-1 rounded-full hover:bg-background/90 z-10 transition-colors"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
          <div className={cn(
            "overflow-hidden",
            getPreviewSizeClasses()
          )}>
            {Array.isArray(internalValue) ? (
              isFileObject(internalValue[0]) && typeof internalValue[0].arrayBuffer === 'function' ? (
                <FilePreview file={internalValue[0]} previewSize={previewSize} />
              ) : (
                <DocumentPreview document={internalValue[0] || {}} className={getPreviewSizeClasses()} />
              )
            ) : typeof internalValue === 'string' ? (
              // Handle string ID references to documents
              <DocumentPreview document={{ id: internalValue }} className={getPreviewSizeClasses()} />
            ) : isFileObject(internalValue) && typeof internalValue.arrayBuffer === 'function' ? (
              <FilePreview file={internalValue} previewSize={previewSize} />
            ) : (
              <DocumentPreview document={internalValue || {}} className={getPreviewSizeClasses()} />
            )}
          </div>
          <div className="text-xs text-muted-foreground truncate p-2 bg-muted/30">
            {Array.isArray(internalValue) 
              ? (internalValue[0]?.name || internalValue[0]?.filename || "Existing file") 
              : typeof internalValue === 'string'
                ? "Existing file"
                : (internalValue?.name || internalValue?.filename || "Existing file")
            }
          </div>
        </div>
      )}
    </div>
  );
};