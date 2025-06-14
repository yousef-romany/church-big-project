
"use client";

import * as React from "react";
import { format, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { arSA } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DatePickerWithPresetsProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
  showPresets?: boolean;
  disabled?: (date: Date) => boolean;
}

export function DatePickerWithPresets({
  date,
  setDate,
  className,
  showPresets = true,
  disabled
}: DatePickerWithPresetsProps) {
  const [open, setOpen] = React.useState(false);

  const presets = [
    { label: "اليوم", value: new Date() },
    { label: "أمس", value: subDays(new Date(), 1) },
    { label: "غداً", value: addDays(new Date(), 1) },
    { label: "هذا الأسبوع (بداية)", value: startOfWeek(new Date(), { locale: arSA }) },
    { label: "الشهر القادم (بداية)", value: startOfMonth(addDays(new Date(), 30)) },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP", { locale: arSA }) : <span>اختر تاريخًا</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        {showPresets && (
          <Select
            onValueChange={(value) => {
              const selectedPreset = presets.find(p => p.label === value);
              if (selectedPreset) setDate(selectedPreset.value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختصارات التاريخ" />
            </SelectTrigger>
            <SelectContent position="popper">
              {presets.map((preset) => (
                <SelectItem key={preset.label} value={preset.label}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <div className="rounded-md border">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate) => {
              setDate(selectedDate);
              setOpen(false); // Close popover on date select
            }}
            locale={arSA}
            initialFocus
            disabled={disabled}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
