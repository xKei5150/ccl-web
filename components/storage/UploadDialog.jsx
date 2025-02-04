import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload } from "lucide-react";


export function UploadDialog({
  isOpen,
  onOpenChange,
  onUpload,
  isDragging,
  setIsDragging,
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
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Drag and drop files here or click to browse
          </DialogDescription>
        </DialogHeader>
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
                if (e.target.files) {
                  onUpload(e.target.files);
                  onOpenChange(false);
                }
              }}
              className="hidden"
            />
            <Button variant="outline" size="sm">
              Browse Files
            </Button>
          </label>
        </div>
      </DialogContent>
    </Dialog>
  );
}