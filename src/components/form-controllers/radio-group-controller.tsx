import React from 'react';
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

type RadioOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type RadioGroupControllerProps<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues | undefined = TFieldValues,
> = Omit<React.ComponentProps<typeof RadioGroup>, 'form' | 'value' | 'onValueChange'> & {
  form: UseFormReturn<TFieldValues, object, TTransformedValues>;
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
  options: RadioOption[];
};

export default function RadioGroupController<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues | undefined = TFieldValues,
>({
  form,
  name,
  label,
  description,
  options,
  ...radioGroupProps
}: RadioGroupControllerProps<TFieldValues, TTransformedValues>) {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel>{label}</FieldLabel>}
          <RadioGroup
            {...radioGroupProps}
            value={field.value ?? ''}
            onValueChange={field.onChange}
            onBlur={field.onBlur}
            aria-invalid={fieldState.invalid}
          >
            {options.map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <RadioGroupItem
                  id={`${name}-${opt.value}`}
                  value={opt.value}
                  disabled={opt.disabled}
                  aria-invalid={fieldState.invalid}
                />
                <FieldLabel htmlFor={`${name}-${opt.value}`}>{opt.label}</FieldLabel>
              </div>
            ))}
          </RadioGroup>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
