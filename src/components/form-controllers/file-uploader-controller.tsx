import React from 'react';
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import { FileUploader, FileUploaderProps } from '../shared/file-uploader';

type FileUploaderControllerProps<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues | undefined = TFieldValues,
> = Omit<FileUploaderProps, 'value' | 'onFilesChange'> & {
  form: UseFormReturn<TFieldValues, object, TTransformedValues>;
  name: Path<TFieldValues>;
  label?: string;
};

export default function FileUploaderController<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues | undefined = TFieldValues,
>({ form, name, label, description, ...uploaderProps }: FileUploaderControllerProps<TFieldValues, TTransformedValues>) {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel>{label}</FieldLabel>}
          <FileUploader {...uploaderProps} value={(field.value as File[]) ?? []} onFilesChange={field.onChange} />
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
