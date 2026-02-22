import React from 'react';
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type SelectControllerProps<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues | undefined = TFieldValues,
> = {
  form: UseFormReturn<TFieldValues, object, TTransformedValues>;
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
  className?: string;
};

export default function SelectController<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues | undefined = TFieldValues,
>({
  form,
  name,
  label,
  description,
  placeholder = 'Select an option',
  options,
  disabled,
  className,
}: SelectControllerProps<TFieldValues, TTransformedValues>) {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
          <Select value={field.value ?? ''} onValueChange={field.onChange} disabled={disabled}>
            <SelectTrigger id={name} className={className} aria-invalid={fieldState.invalid} onBlur={field.onBlur}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
