"use client";;
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function CustomCalendar() {
  const [date, setDate] = useState(new Date());

  const handleCalendarChange = (
    _value,
    _e,
  ) => {
    const _event = {
      target: {
        value: String(_value),
      }
    };
    _e(_event);
  };

  return (
    (<>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-lg border border-border p-2"
        classNames={{
          month_caption: "mx-0",
        }}
        captionLayout="dropdown"
        defaultMonth={new Date()}
        startMonth={new Date(1980, 6)}
        hideNavigation
        components={{
          DropdownNav: (props) => {
            return <div className="flex w-full items-center gap-2">{props.children}</div>;
          },
          Dropdown: (props) => {
            return (
              (<Select
                value={String(props.value)}
                onValueChange={(value) => {
                  if (props.onChange) {
                    handleCalendarChange(value, props.onChange);
                  }
                }}>
                <SelectTrigger className="h-8 w-fit font-medium first:grow">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  className="max-h-[min(26rem,var(--radix-select-content-available-height))]">
                  {props.options?.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={String(option.value)}
                      disabled={option.disabled}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>)
            );
          },
        }} />
      <p
        className="mt-4 text-center text-xs text-muted-foreground"
        role="region"
        aria-live="polite">
        Monthly / yearly selects -{" "}
        <a
          className="underline hover:text-foreground"
          href="https://daypicker.dev/"
          target="_blank"
          rel="noopener nofollow">
          React DayPicker
        </a>
      </p>
    </>)
  );
}
