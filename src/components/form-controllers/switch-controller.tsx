import React from 'react';
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import { Switch } from '../ui/switch';

type SwitchControllerProps<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues | undefined = TFieldValues,
> = Omit<React.ComponentProps<typeof Switch>, 'form' | 'checked' | 'onCheckedChange'> & {
  form: UseFormReturn<TFieldValues, object, TTransformedValues>;
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
};

export default function SwitchController<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues | undefined = TFieldValues,
>({ form, name, label, description, ...switchProps }: SwitchControllerProps<TFieldValues, TTransformedValues>) {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <div className="flex items-center gap-2">
            <Switch
              {...switchProps}
              id={name}
              checked={!!field.value}
              onCheckedChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              aria-invalid={fieldState.invalid}
            />
            {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
          </div>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
