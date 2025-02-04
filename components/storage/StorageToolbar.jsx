import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FolderPlus, Grid2X2, Grid3X3, AlignJustify, Upload } from "lucide-react";

export function StorageToolbar({
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
  viewMode,
  setViewMode,
  onNewFolder,
  onUpload,
}) {
  return (
    <div className="flex gap-4 items-center">
      <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="date">Date</SelectItem>
          <SelectItem value="type">Type</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
      >
        {sortDirection === "asc" ? "↑" : "↓"}
      </Button>

      <Select value={viewMode} onValueChange={(value) => setViewMode(value)}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="View" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="grid">
            <div className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4" />
              Large Grid
            </div>
          </SelectItem>
          <SelectItem value="compact">
            <div className="flex items-center gap-2">
              <Grid2X2 className="w-4 h-4" />
              Compact Grid
            </div>
          </SelectItem>
          <SelectItem value="list">
            <div className="flex items-center gap-2">
              <AlignJustify className="w-4 h-4" />
              List
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={onNewFolder}>
        <FolderPlus className="w-4 h-4 mr-2" />
        New Folder
      </Button>

      <Button onClick={onUpload}>
        <Upload className="w-4 h-4 mr-2" />
        Upload Files
      </Button>
    </div>
  );
}