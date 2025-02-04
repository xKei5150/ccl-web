import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function NewFolderDialog({
  isOpen,
  onOpenChange,
  folderName,
  setFolderName,
  onCreateFolder,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>Enter a name for the new folder</DialogDescription>
        </DialogHeader>
        <Input
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Folder name"
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onCreateFolder}>Create</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}