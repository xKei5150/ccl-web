import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Upload, Trash } from 'lucide-react';
import {FilePreview} from '@/components/ui/file-preview'; // Assuming you have these components
import DocumentPreview from '@/components/layout/DocumentPreview'; // Assuming you have these components

export const FileUpload = ({ onFileSelect, value, accept, onRemove = () => {} }) => {
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
  return (
    <div>
      {value === null && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors",
            isDragActive ? "border-primary bg-primary/10" : "border-border",
            "hover:border-primary/50"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Upload className="h-8 w-8" />
            {isDragActive ? (
              <p>Drop the file here</p>
            ) : (
              <p>Drag & drop a file here, or click to select</p>
            )}
          </div>
        </div>
      )}

      {value && (
        <div className="relative">
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-0 right-0 text-destructive hover:text-destructive"
          >
            <Trash className="h-4 w-4" />
            <span className="sr-only">Remove file</span>
          </button>
          {console.log(value + ' File or Document instance: ' + (Array.isArray(value) ? value[0] instanceof File : value instanceof File))}
          {console.log('Constructor of value:', Array.isArray(value) ? value[0].constructor.name : value.constructor.name)}
          {Array.isArray(value) ? (
            value[0] instanceof File ? (
              <FilePreview file={value[0]} />
            ) : (
              <DocumentPreview document={value[0]} />
            )
          ) : (
            value instanceof File ? (
              <FilePreview file={value} />
            ) : (
              <DocumentPreview document={value} />
            )
          )}
        </div>
      )}
    </div>
  );
};