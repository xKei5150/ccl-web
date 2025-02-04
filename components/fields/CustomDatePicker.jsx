"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function CustomDatePicker() {
  const [date, setDate] = React.useState();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          className="rounded-lg border border-border p-2"
          classNames={{
            month_caption: "mx-0",
          }}
          captionLayout="Dropdown"
          defaultMonth={new Date()}
          startMonth={new Date(1980, 6)}
          hideNavigation
          components={{
            DropdownNav: (props) => {
              return (
                <div className="flex w-full items-center gap-2">
                  {props.children}
                </div>
              );
            },
            Dropdown: (props) => {
              const handleMonthChange = (value) => {
                if (props.onMonthChange) {
                  handleCalendarChange(value, props.onMonthChange);
                }
              };
            
              const handleYearChange = (value) => {
                if (props.onYearChange) {
                  handleCalendarChange(value, props.onYearChange);
                }
              };
            
              return (
                <div className="flex space-x-2">
                  <Select
                    value={String(props.month)}
                    onValueChange={handleMonthChange}
                  >
                    <SelectTrigger className="h-8 w-fit font-medium first:grow">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[min(26rem,var(--radix-select-content-available-height))]">
                      {props.monthOptions?.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={String(option.value)}
                          disabled={option.disabled}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
            
                  <Select
                    value={String(props.year)}
                    onValueChange={handleYearChange}
                  >
                    <SelectTrigger className="h-8 w-fit font-medium first:grow">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[min(26rem,var(--radix-select-content-available-height))]">
                      {props.yearOptions?.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={String(option.value)}
                          disabled={option.disabled}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            },
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
