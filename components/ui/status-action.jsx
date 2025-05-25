"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Check, Clock, AlertCircle, XCircle, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const StatusAction = ({ 
  row, 
  statusField = "status", 
  statusOptions = [], 
  updateAction,
  disabled = false,
  className 
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const currentStatus = row[statusField];

  const getStatusIcon = (status) => {
    // Generic status icons based on common patterns
    if (status.includes('pending') || status.includes('open')) {
      return <Clock className="h-3 w-3" />;
    }
    if (status.includes('progress') || status.includes('processing')) {
      return <Loader2 className="h-3 w-3" />;
    }
    if (status.includes('approved') || status.includes('completed') || status.includes('closed')) {
      return <CheckCircle className="h-3 w-3" />;
    }
    if (status.includes('rejected')) {
      return <XCircle className="h-3 w-3" />;
    }
    if (status.includes('requires') || status.includes('presence')) {
      return <AlertCircle className="h-3 w-3" />;
    }
    return <Check className="h-3 w-3" />;
  };

  const getStatusColor = (status) => {
    if (status.includes('pending') || status.includes('open')) {
      return "text-yellow-600";
    }
    if (status.includes('progress') || status.includes('processing')) {
      return "text-blue-600";
    }
    if (status.includes('approved') || status.includes('completed') || status.includes('closed')) {
      return "text-green-600";
    }
    if (status.includes('rejected')) {
      return "text-red-600";
    }
    if (status.includes('requires') || status.includes('presence')) {
      return "text-orange-600";
    }
    return "text-gray-600";
  };

  const handleStatusUpdate = async (newStatus) => {
    if (newStatus === currentStatus || !updateAction) return;

    setIsUpdating(true);
    try {
      await updateAction(row.id, { [statusField]: newStatus });
      toast({
        title: "Status Updated",
        description: `Status changed to ${statusOptions.find(opt => opt.value === newStatus)?.label || newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (disabled || !updateAction || statusOptions.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn("h-8 w-8 p-0", className)}
          disabled={isUpdating}
        >
          <span className="sr-only">Open status menu</span>
          {isUpdating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MoreHorizontal className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {statusOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleStatusUpdate(option.value)}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              currentStatus === option.value && "bg-muted"
            )}
          >
            <span className={getStatusColor(option.value)}>
              {getStatusIcon(option.value)}
            </span>
            <span className="flex-1">{option.label}</span>
            {currentStatus === option.value && (
              <Check className="h-3 w-3 text-green-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusAction; 