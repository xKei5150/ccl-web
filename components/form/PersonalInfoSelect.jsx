"use client";

import { useCallback, useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useStaffManagement } from "@/hooks/use-staff-management";

export function PersonalInfoSelect({ userId, personalInfo = [], value, className }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { handleLinkPersonalInfo, isLoading } = useStaffManagement();

  const filteredInfo = personalInfo.filter((info) => 
    info.name?.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = useCallback(
    async (currentValue) => {
      if (currentValue === value) return;
      await handleLinkPersonalInfo(userId, currentValue);
      setOpen(false);
    },
    [handleLinkPersonalInfo, userId, value]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between min-w-[200px]", className)}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : value ? (
            personalInfo.find((info) => info.id === value)?.name?.fullName
          ) : (
            "Select personal info..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Search personal info..." 
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {isLoading ? (
              <CommandLoading>Loading personal information...</CommandLoading>
            ) : filteredInfo.length === 0 ? (
              <CommandEmpty>No personal info found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredInfo.map((info) => (
                  <CommandItem
                    key={info.id}
                    value={info.id}
                    onSelect={handleSelect}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === info.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {info.name?.fullName}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}