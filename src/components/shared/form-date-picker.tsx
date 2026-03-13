"use client";

import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface FormDatePickerProps {
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  disabled?: boolean;
}

export default function FormDatePicker({
  label,
  error,
  helperText,
  placeholder = 'اختر التاريخ',
  value,
  onChange,
  disabled
}: FormDatePickerProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    onChange?.(date);
    setOpen(false);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2 text-right">
          {label}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-full justify-start text-right ${error ? 'border-red-500' : ''}`}
            disabled={disabled}
          >
            <CalendarIcon className="ml-2 h-4 w-4" />
            {value ? format(value, 'dd MMMM yyyy', { locale: ar }) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleSelect}
            initialFocus
            locale={ar}
            className="rtl"
          />
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-sm text-red-500 mt-1 text-right">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground mt-1 text-right">
          {helperText}
        </p>
      )}
    </div>
  );
}
