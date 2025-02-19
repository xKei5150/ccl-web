"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { StaffCard } from "@/components/layout/StaffCard";
import { Users, Check, ChevronsUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { deleteStaffMember, updateStaffMember } from "@/app/(app)/dashboard/staff/actions";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function StaffList({ data, availableUsers }) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleDelete = async (ids) => {
    try {
      await deleteStaffMember(ids);
      toast({
        title: "Success",
        description: "Staff member(s) deleted successfully",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete staff member(s)",
        variant: "destructive",
      });
    }
  };

  const handleAssignStaff = async (userId) => {
    if (!userId) return;
    
    try {
      await updateStaffMember({ role: 'staff' }, userId);
      toast({
        title: "Success",
        description: "User assigned as staff successfully",
      });
      router.refresh();
      setOpen(false);
      setSelectedUser(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign staff role",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Staff Management"
        subtitle="View and manage staff members"
        icon={<Users className="h-8 w-8" />}
        action={
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[250px] justify-between"
              >
                {selectedUser ? 
                  availableUsers.find(user => user.id === selectedUser)?.email 
                  : "Select user to assign..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
              <Command>
                <CommandInput placeholder="Search users..." />
                <CommandEmpty>No users found.</CommandEmpty>
                <CommandGroup>
                  {availableUsers?.map((user) => (
                    <CommandItem
                      key={user.id}
                      value={user.email}
                      onSelect={() => handleAssignStaff(user.id)}
                    >
                      {user.email}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedUser === user.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {data?.docs?.map((staff) => (
          <StaffCard
            key={staff.id}
            staff={staff}
            onEdit={() => router.push(`/dashboard/staff/${staff.id}/edit`)}
            onDelete={() => handleDelete([staff.id])}
          />
        ))}
      </div>
    </div>
  );
}