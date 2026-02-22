import React from 'react';
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '../ui/combobox';

type ComboboxOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type ComboboxControllerProps<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues | undefined = TFieldValues,
> = {
  form: UseFormReturn<TFieldValues, object, TTransformedValues>;
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
  placeholder?: string;
  options: ComboboxOption[];
  disabled?: boolean;
  className?: string;
};

export default function ComboboxController<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues | undefined = TFieldValues,
>({
  form,
  name,
  label,
  description,
  placeholder = 'Search...',
  options,
  disabled,
  className,
}: ComboboxControllerProps<TFieldValues, TTransformedValues>) {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
          <Combobox value={field.value ?? null} onValueChange={field.onChange} disabled={disabled}>
            <ComboboxInput
              id={name}
              placeholder={placeholder}
              className={className}
              onBlur={field.onBlur}
              aria-invalid={fieldState.invalid}
              showClear
            />
            <ComboboxContent>
              <ComboboxList>
                <ComboboxEmpty>No results found.</ComboboxEmpty>
                {options.map((opt) => (
                  <ComboboxItem key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
