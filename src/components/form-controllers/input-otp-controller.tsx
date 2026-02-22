import React from 'react';
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../ui/input-otp';

type InputOTPControllerProps<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues | undefined = TFieldValues,
> = {
  form: UseFormReturn<TFieldValues, object, TTransformedValues>;
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
  /** Total number of OTP digits. Default: 6 */
  maxLength?: number;
  /** Number of slots per group. Default: [3, 3] for maxLength=6 */
  groups?: number[];
  /** Whether to show a separator between groups. Default: true */
  showSeparator?: boolean;
};

export default function InputOTPController<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues | undefined = TFieldValues,
>({
  form,
  name,
  label,
  description,
  maxLength = 6,
  groups,
  showSeparator = true,
}: InputOTPControllerProps<TFieldValues, TTransformedValues>) {
  const resolvedGroups = groups ?? [Math.ceil(maxLength / 2), Math.floor(maxLength / 2)];

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => {
        let slotIndex = 0;

        return (
          <Field data-invalid={fieldState.invalid}>
            {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
            <InputOTP
              id={name}
              maxLength={maxLength}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              aria-invalid={fieldState.invalid}
            >
              {resolvedGroups.map((groupSize, groupIdx) => {
                const groupSlots = Array.from({ length: groupSize }, (_, i) => slotIndex + i);
                slotIndex += groupSize;

                return (
                  <React.Fragment key={groupIdx}>
                    <InputOTPGroup>
                      {groupSlots.map((idx) => (
                        <InputOTPSlot key={idx} index={idx} />
                      ))}
                    </InputOTPGroup>
                    {showSeparator && groupIdx < resolvedGroups.length - 1 && <InputOTPSeparator />}
                  </React.Fragment>
                );
              })}
            </InputOTP>
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
