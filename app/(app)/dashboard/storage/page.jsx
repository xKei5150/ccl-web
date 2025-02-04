"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { Link2, Download, Trash2, ArrowLeft, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilePreview } from "@/components/storage/FilePreview";
import { StorageBreadcrumb } from "@/components/storage/StorageBreadcrumb";
import { StorageToolbar } from "@/components/storage/StorageToolbar";
import { UploadDialog } from "@/components/storage/UploadDialog";
import { NewFolderDialog } from "@/components/storage/NewFolderDialog";

export default function Storage() {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [currentFolder, setCurrentFolder] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [folderPath, setFolderPath] = useState([]);

  const handleFileUpload = (uploadedFiles) => {
    Array.from(uploadedFiles).forEach((file) => {
      const fileUrl = URL.createObjectURL(file);
      const newFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        url: fileUrl,
        uploadedAt: new Date(),
        parentFolder: currentFolder,
      };
      setFiles((prev) => [...prev, newFile]);
    });

    toast({
      title: "Files uploaded successfully",
      description: `${uploadedFiles.length} file(s) have been uploaded.`,
    });
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;

    const newFolder = {
      id: Math.random().toString(36).substr(2, 9),
      name: newFolderName,
      createdAt: new Date(),
    };

    setFolders((prev) => [...prev, newFolder]);
    setNewFolderName("");
    setShowNewFolderDialog(false);
    toast({
      title: "Folder created",
      description: `Folder "${newFolderName}" has been created.`,
    });
  };

  const handleShare = (fileId) => {
    const file = files.find((f) => f.id === fileId);
    if (file) {
      navigator.clipboard.writeText(file.url);
      toast({
        title: "Link copied",
        description: "File link has been copied to clipboard",
      });
    }
  };

  const handleDelete = (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    toast({
      title: "File deleted",
      description: "The file has been removed from storage",
    });
  };

  const sortFiles = (files) => {
    return [...files].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "date":
          comparison = a.uploadedAt.getTime() - b.uploadedAt.getTime();
          break;
        case "type":
          comparison = a.type.localeCompare(b.type);
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
  };

  const handleFolderClick = (folder) => {
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

  const filteredFiles = sortFiles(
    files.filter((file) => file.parentFolder === currentFolder)
  );

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
          onNewFolder={() => setShowNewFolderDialog(true)}
          onUpload={() => setIsUploadOpen(true)}
        />
      </div>

      {currentFolder && (
        <Button variant="ghost" onClick={navigateBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      )}

      {/* Folders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {folders
          .filter((folder) => !currentFolder)
          .map((folder) => (
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

      {/* Files Grid/List/Compact View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {filteredFiles.map((file) => (
            <ContextMenu key={file.id}>
              <ContextMenuTrigger>
                <div className="border rounded-lg p-4 space-y-3">
                  <FilePreview file={file} />
                  <div className="mt-2">
                    <h3 className="font-medium truncate">{file.name}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(file.uploadedAt).toLocaleDateString()}
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
                    download={file.name}
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mt-6">
          {filteredFiles.map((file) => (
            <ContextMenu key={file.id}>
              <ContextMenuTrigger>
                <div className="border rounded-lg p-2 space-y-2">
                  <div className="h-24">
                    <FilePreview file={file} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium truncate">{file.name}</h3>
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
                    download={file.name}
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
        <div className="space-y-4 mt-6">
          {filteredFiles.map((file) => (
            <ContextMenu key={file.id}>
              <ContextMenuTrigger>
                <div className="border rounded-lg p-4 flex items-center gap-4">
                  <div className="w-16 h-16 flex-shrink-0">
                    <FilePreview file={file} />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{file.name}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(file.uploadedAt).toLocaleDateString()}
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
                    download={file.name}
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

      <UploadDialog
        isOpen={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        onUpload={handleFileUpload}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
      />

      <NewFolderDialog
        isOpen={showNewFolderDialog}
        onOpenChange={setShowNewFolderDialog}
        folderName={newFolderName}
        setFolderName={setNewFolderName}
        onCreateFolder={handleCreateFolder}
      />
    </div>
  );
}