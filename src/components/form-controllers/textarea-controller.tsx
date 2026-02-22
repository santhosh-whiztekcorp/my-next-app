import React from 'react';
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import { Textarea } from '../ui/textarea';

type TextareaControllerProps<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues | undefined = TFieldValues,
> = Omit<React.ComponentProps<'textarea'>, 'form'> & {
  form: UseFormReturn<TFieldValues, object, TTransformedValues>;
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
};

export default function TextareaController<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues | undefined = TFieldValues,
>({
  form,
  name,
  label,
  description,
  placeholder,
  ...textareaProps
}: TextareaControllerProps<TFieldValues, TTransformedValues>) {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
          <Textarea
            {...field}
            {...textareaProps}
            id={name}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
