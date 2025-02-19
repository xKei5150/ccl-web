"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { useCallback, useEffect, useState } from "react";

export function PersonalInfoSelect({ onSelect, defaultValue }) {
  const [open, setOpen] = useState(false);
  const [people, setPeople] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPeople = useCallback(async () => {
    try {
      const response = await fetch("/api/personal-information?limit=100");
      const data = await response.json();
      setPeople(data.docs);

      // If we have a defaultValue, find and set the selected person
      if (defaultValue) {
        const defaultPerson = data.docs.find(p => p.id === defaultValue.id);
        if (defaultPerson) {
          setSelected(defaultPerson);
        } else {
          // If not found in initial list, fetch the specific person
          const personResponse = await fetch(`/api/personal-information/${defaultValue}`);
          const personData = await personResponse.json();
          if (personData) {
            setSelected(personData);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching personal information:", error);
    } finally {
      setLoading(false);
    }
  }, [defaultValue]);

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  function handleSelect(person) {
    console.log("Selected person:", person);
    setSelected(person);
    setOpen(false);
    onSelect(person.id);
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selected ? `${selected.name?.fullName}` : "Select person..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search people..." />
          <CommandEmpty>
            {loading ? "Loading..." : "No person found."}
          </CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {people.map((person) => (
              <CommandItem
                key={person.id}
                value={person.name.fullName}
                onSelect={() => handleSelect(person)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selected?.id === person.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {person.name.fullName}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}