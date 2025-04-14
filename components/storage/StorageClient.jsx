"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { Link2, Download, Trash2, ArrowLeft, FolderOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilePreview } from "@/components/storage/FilePreview";
import { StorageBreadcrumb } from "@/components/storage/StorageBreadcrumb";
import { StorageToolbar } from "@/components/storage/StorageToolbar";
import { UploadDialog } from "@/components/storage/UploadDialog";
import { NewFolderDialog } from "@/components/storage/NewFolderDialog";
import { getFiles, getFolders, uploadFile, createFolder, deleteFile, deleteFolder } from "@/app/(app)/dashboard/storage/actions";

export function StorageClient() {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [currentFolder, setCurrentFolder] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [folderPath, setFolderPath] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Load files and folders on component mount and when currentFolder changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get files and folders using server actions
        const filesResponse = await getFiles(currentFolder);
        const foldersResponse = await getFolders(currentFolder);
        
        setFiles(filesResponse.docs || []);
        setFolders(foldersResponse.docs || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error loading files",
          description: error.message || "There was a problem loading your files and folders.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentFolder, toast]);

  const handleFileUpload = async (uploadedFiles) => {
    if (!uploadedFiles || uploadedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to upload",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    const failedUploads = [];
    
    try {
      for (const file of Array.from(uploadedFiles)) {
        const formData = new FormData();
        formData.append('file', file);
        
        // If we're in a folder, add the folder ID
        if (currentFolder) {
          formData.append('folder', currentFolder);
        }
        
        try {
          await uploadFile(formData);
        } catch (uploadError) {
          console.error(`Failed to upload ${file.name}:`, uploadError);
          failedUploads.push({ name: file.name, error: uploadError.message });
        }
      }
      
      // Refresh the file list
      const filesResponse = await getFiles(currentFolder);
      setFiles(filesResponse.docs || []);
      
      if (failedUploads.length === 0) {
        toast({
          title: "Files uploaded successfully",
          description: `${uploadedFiles.length} file(s) have been uploaded.`,
        });
      } else if (failedUploads.length < uploadedFiles.length) {
        toast({
          title: "Some files failed to upload",
          description: `${uploadedFiles.length - failedUploads.length} file(s) uploaded, ${failedUploads.length} failed.`,
          variant: "warning",
        });
      } else {
        toast({
          title: "Upload failed",
          description: "All files failed to upload. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload files.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setIsUploadOpen(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Folder name required",
        description: "Please enter a name for the folder",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const folderData = {
        name: newFolderName,
        parent: currentFolder || null,
      };
      
      await createFolder(folderData);
      
      // Refresh folders
      const foldersResponse = await getFolders(currentFolder);
      setFolders(foldersResponse.docs || []);
      
      setNewFolderName("");
      setIsNewFolderOpen(false);
      
      toast({
        title: "Folder created",
        description: `Folder "${newFolderName}" has been created.`,
      });
    } catch (error) {
      console.error('Folder creation error:', error);
      toast({
        title: "Failed to create folder",
        description: error.message || "There was a problem creating the folder.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (fileId) => {
    try {
      const file = files.find(f => f.id === fileId);
      if (file && file.url) {
        await navigator.clipboard.writeText(file.url);
        toast({
          title: "Link copied",
          description: "File link has been copied to clipboard",
        });
      } else {
        toast({
          title: "Unable to copy link",
          description: "The file URL is not available",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Share error:', error);
      toast({
        title: "Failed to copy link",
        description: error.message || "There was a problem copying the file link.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await deleteFile(fileId);
      
      // Update local state to remove the file
      setFiles(prev => prev.filter(f => f.id !== fileId));
      
      toast({
        title: "File deleted",
        description: "The file has been removed from storage",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Failed to delete file",
        description: error.message || "There was a problem deleting the file.",
        variant: "destructive",
      });
    }
  };

  const sortFiles = (files) => {
    return [...files].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.filename?.localeCompare(b.filename) || 0;
          break;
        case "date":
          const aDate = new Date(a.updatedAt || a.createdAt);
          const bDate = new Date(b.updatedAt || b.createdAt);
          comparison = aDate.getTime() - bDate.getTime();
          break;
        case "type":
          comparison = a.mimeType?.localeCompare(b.mimeType) || 0;
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
  };

  const handleFolderClick = async (folder) => {
    setCurrentFolder(folder.id);
    setFolderPath((prev) => [...prev, folder]);
  };

  const navigateBack = () => {
    if (folderPath.length > 0) {
      const newPath = [...folderPath];
      newPath.pop();
      setFolderPath(newPath);
      setCurrentFolder(newPath.length > 0 ? newPath[newPath.length - 1].id : null);
    }
  };

  const filteredFiles = sortFiles(files);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Storage</h1>
          <StorageBreadcrumb
            folderPath={folderPath}
            onNavigate={(folderId) => {
              if (folderId === null) {
                setCurrentFolder(null);
                setFolderPath([]);
              } else {
                const folderIndex = folderPath.findIndex((f) => f.id === folderId);
                const newPath = folderPath.slice(0, folderIndex + 1);
                setFolderPath(newPath);
                setCurrentFolder(folderId);
              }
            }}
          />
        </div>
        <StorageToolbar
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onNewFolder={() => setIsNewFolderOpen(true)}
          onUpload={() => setIsUploadOpen(true)}
        />
      </div>

      {currentFolder && (
        <Button variant="ghost" onClick={navigateBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2">Loading files...</span>
        </div>
      ) : (
        <>
          {/* Folders Grid */}
          {folders.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleFolderClick(folder)}
                >
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-6 h-6 text-blue-500" />
                    <span>{folder.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Files Grid/List/Compact View */}
          {filteredFiles.length > 0 ? (
            <>
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredFiles.map((file) => (
                    <ContextMenu key={file.id}>
                      <ContextMenuTrigger>
                        <div className="border rounded-lg p-4 space-y-3">
                          <FilePreview file={file} />
                          <div className="mt-2">
                            <h3 className="font-medium truncate">{file.filename}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(file.updatedAt || file.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem onClick={() => handleShare(file.id)}>
                          <Link2 className="w-4 h-4 mr-2" />
                          Share Link
                        </ContextMenuItem>
                        <ContextMenuItem>
                          <a
                            href={file.url}
                            download={file.filename}
                            className="flex items-center"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </a>
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem
                          onClick={() => handleDelete(file.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  ))}
                </div>
              )}

              {viewMode === "compact" && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                  {filteredFiles.map((file) => (
                    <ContextMenu key={file.id}>
                      <ContextMenuTrigger>
                        <div className="border rounded-lg p-2 space-y-2">
                          <div className="h-24">
                            <FilePreview file={file} />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium truncate">{file.filename}</h3>
                          </div>
                        </div>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem onClick={() => handleShare(file.id)}>
                          <Link2 className="w-4 h-4 mr-2" />
                          Share Link
                        </ContextMenuItem>
                        <ContextMenuItem>
                          <a
                            href={file.url}
                            download={file.filename}
                            className="flex items-center"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </a>
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem
                          onClick={() => handleDelete(file.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  ))}
                </div>
              )}

              {viewMode === "list" && (
                <div className="space-y-4">
                  {filteredFiles.map((file) => (
                    <ContextMenu key={file.id}>
                      <ContextMenuTrigger>
                        <div className="border rounded-lg p-4 flex items-center gap-4">
                          <div className="w-16 h-16 flex-shrink-0">
                            <FilePreview file={file} />
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-medium">{file.filename}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(file.updatedAt || file.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem onClick={() => handleShare(file.id)}>
                          <Link2 className="w-4 h-4 mr-2" />
                          Share Link
                        </ContextMenuItem>
                        <ContextMenuItem>
                          <a
                            href={file.url}
                            download={file.filename}
                            className="flex items-center"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </a>
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem
                          onClick={() => handleDelete(file.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10 border border-dashed rounded-lg">
              <p className="text-gray-500">No files found in this location</p>
            </div>
          )}
        </>
      )}

      <UploadDialog
        isOpen={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        onUpload={handleFileUpload}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        isUploading={isUploading}
      />

      <NewFolderDialog
        isOpen={isNewFolderOpen}
        onOpenChange={setIsNewFolderOpen}
        folderName={newFolderName}
        setFolderName={setNewFolderName}
        onCreateFolder={handleCreateFolder}
      />
    </div>
  );
} 