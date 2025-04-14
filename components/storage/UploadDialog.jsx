import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, Loader2 } from "lucide-react";


export function UploadDialog({
  isOpen,
  onOpenChange,
  onUpload,
  isDragging,
  setIsDragging,
  isUploading = false,
}) {
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    onUpload(e.dataTransfer.files);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isUploading && onOpenChange(open)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            {isUploading ? "Uploading files..." : "Drag and drop files here or click to browse"}
          </DialogDescription>
        </DialogHeader>
        {isUploading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-sm text-gray-600">Uploading your files. Please wait...</p>
          </div>
        ) : (
          <div
            className={`mt-4 border-2 border-dashed rounded-lg p-12 text-center ${
              isDragging ? "border-primary bg-primary/10" : "border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop your files here, or
            </p>
            <label className="relative">
              <input
                type="file"
                multiple
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    onUpload(e.target.files);
                  }
                }}
                className="hidden"
              />
              <Button variant="outline" size="sm">
                Browse Files
              </Button>
            </label>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}