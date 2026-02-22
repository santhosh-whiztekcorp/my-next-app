import React from 'react';
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import { Slider } from '../ui/slider';

type SliderControllerProps<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues | undefined = TFieldValues,
> = Omit<React.ComponentProps<typeof Slider>, 'form' | 'value' | 'onValueChange'> & {
  form: UseFormReturn<TFieldValues, object, TTransformedValues>;
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
};

export default function SliderController<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues | undefined = TFieldValues,
>({
  form,
  name,
  label,
  description,
  min = 0,
  max = 100,
  step = 1,
  ...sliderProps
}: SliderControllerProps<TFieldValues, TTransformedValues>) {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => {
        const value = Array.isArray(field.value) ? field.value : field.value != null ? [field.value] : [min];

        return (
          <Field data-invalid={fieldState.invalid}>
            {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
            <Slider
              {...sliderProps}
              id={name}
              min={min}
              max={max}
              step={step}
              value={value}
              onValueChange={(vals) => field.onChange(vals.length === 1 ? vals[0] : vals)}
              onBlur={field.onBlur}
              aria-invalid={fieldState.invalid}
            />
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
