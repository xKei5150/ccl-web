import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export function StorageBreadcrumb({ folderPath, onNavigate }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigate(null)}
      >
        Home
      </Button>
      {folderPath.map((folder, index) => (
        <div key={folder.id} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-gray-500" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onNavigate(folder.id);
            }}
          >
            {folder.name}
          </Button>
        </div>
      ))}
    </div>
  );
}