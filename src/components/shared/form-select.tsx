"use client";

import { forwardRef } from 'react';
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FormSelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

const FormSelect = forwardRef<HTMLButtonElement, FormSelectProps>(
  ({ label, error, helperText, options, placeholder, value, onValueChange, disabled }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-2 text-right">
            {label}
          </label>
        )}
        <ShadcnSelect
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
        >
          <SelectTrigger ref={ref} className={error ? 'border-red-500' : ''}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </ShadcnSelect>
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
);

FormSelect.displayName = 'FormSelect';

export default FormSelect;
