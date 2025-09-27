
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type ValidationRule = {
  test: (value: string) => boolean;
  message: string;
};

export type ValidationRules = {
  required?: { value: boolean; message: string };
  pattern?: ValidationRule;
  custom?: ValidationRule[];
};

export interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  validation?: ValidationRules;
  className?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  validation,
  className,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<boolean>(false);

  const validateInput = (inputValue: string): boolean => {
    if (!validation) return true;
    
    // Required validation
    if (validation.required?.value && !inputValue) {
      setError(validation.required.message);
      return false;
    }
    
    // Pattern validation
    if (validation.pattern && !validation.pattern.test(inputValue) && inputValue) {
      setError(validation.pattern.message);
      return false;
    }
    
    // Custom validation rules
    if (validation.custom) {
      for (const rule of validation.custom) {
        if (!rule.test(inputValue)) {
          setError(rule.message);
          return false;
        }
      }
    }
    
    setError(null);
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    if (touched) {
      validateInput(newValue);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    validateInput(value);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={cn(error && touched && "border-red-500")}
      />
      {error && touched && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default FormInput;
