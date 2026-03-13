"use client";

import { forwardRef } from 'react';
import { Input as ShadcnInput } from '@/components/ui/input';

interface FormInputProps extends React.ComponentProps<typeof ShadcnInput> {
  label?: string;
  error?: string;
  helperText?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-2 text-right">
            {label}
          </label>
        )}
        <ShadcnInput
          ref={ref}
          className={`text-right ${error ? 'border-red-500' : ''} ${className || ''}`}
          {...props}
        />
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

FormInput.displayName = 'FormInput';

export default FormInput;
