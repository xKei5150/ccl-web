import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Camera } from 'lucide-react';

export const CircularPhotoUpload = ({ onFileSelect, value, className }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative w-32 h-32 rounded-full cursor-pointer transition-all",
        "border-2 border-dashed",
        isDragActive ? "border-primary bg-primary/10" : "border-border",
        "hover:border-primary/50",
        className
      )}
    >
      <input {...getInputProps()} />
      {value ? (
        <img
          src={value}
          alt="Profile"
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Camera className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mt-2">
            {isDragActive ? "Drop photo here" : "Upload photo"}
          </p>
        </div>
      )}
    </div>
  );
};