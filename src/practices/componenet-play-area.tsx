'use client';

import { ThemeToggle } from '@/components/shared/theme-switcher';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup } from '@/components/ui/field';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';

import InputController from '@/components/form-controllers/input-controller';
import TextareaController from '@/components/form-controllers/textarea-controller';
import CheckboxController from '@/components/form-controllers/checkbox-controller';
import SwitchController from '@/components/form-controllers/switch-controller';
import SelectController from '@/components/form-controllers/select-controller';
import RadioGroupController from '@/components/form-controllers/radio-group-controller';
import SliderController from '@/components/form-controllers/slider-controller';
import InputOTPController from '@/components/form-controllers/input-otp-controller';
import ComboboxController from '@/components/form-controllers/combobox-controller';
import FileUploaderController from '@/components/form-controllers/file-uploader-controller';

const formSchema = z.object({
  title: z
    .string()
    .min(5, 'Bug title must be at least 5 characters.')
    .max(32, 'Bug title must be at most 32 characters.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters.')
    .max(100, 'Description must be at most 100 characters.'),
  severity: z.string().min(1, 'Please select a severity level.'),
  platform: z.string().min(1, 'Please select a platform.'),
  reproducible: z.boolean(),
  notify: z.boolean(),
  priority: z.number().min(0).max(100),
  affectedUsers: z
    .number({ error: 'Please enter a valid number.' })
    .int('Must be a whole number.')
    .min(1, 'At least 1 user must be affected.'),
  otp: z.string().length(6, 'OTP must be 6 digits.'),
  assignee: z.string().min(1, 'Please select an assignee.'),
  attachments: z.array(z.instanceof(File)).optional(),
});

const severityOptions = [
  { label: 'Critical', value: 'critical' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

const platformOptions = [
  { label: 'Web', value: 'web' },
  { label: 'iOS', value: 'ios' },
  { label: 'Android', value: 'android' },
  { label: 'Desktop', value: 'desktop' },
];

const assigneeOptions = [
  { label: 'Alice Johnson', value: 'alice' },
  { label: 'Bob Smith', value: 'bob' },
  { label: 'Carol Williams', value: 'carol' },
  { label: 'David Brown', value: 'david' },
  { label: 'Eva Martinez', value: 'eva' },
];

export default function ComponentPlayArea() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      password: '',
      description: '',
      severity: '',
      platform: '',
      reproducible: false,
      notify: false,
      priority: 50,
      affectedUsers: 1,
      otp: '',
      assignee: '',
      attachments: [],
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast('You submitted the following values:', {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: 'bottom-right',
      classNames: { content: 'flex flex-col gap-2' },
      style: { '--border-radius': 'calc(var(--radius) + 4px)' } as React.CSSProperties,
    });
  }

  return (
    <div className="from-background to-accent/5 flex min-h-screen flex-col items-center gap-12 bg-linear-to-b p-12">
      <div className="mx-auto flex w-full max-w-7xl items-baseline justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black">Component Play Area</h1>
          <p className="text-muted-foreground font-medium">
            Testing high-end shared components in a sandbox environment.
          </p>
        </div>
        <ThemeToggle />
      </div>

      <div className="flex w-full items-center justify-center gap-4">
        <Card className="w-full sm:max-w-lg">
          <CardHeader>
            <CardTitle>Bug Report</CardTitle>
            <CardDescription>Help us improve by reporting bugs you encounter.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                  {/* Text input */}
                  <InputController
                    name="title"
                    form={form}
                    label="Bug Title"
                    placeholder="Login button not working on mobile"
                    description="A short, descriptive title for the bug."
                  />

                  {/* Password input */}
                  <InputController
                    name="password"
                    form={form}
                    type="password"
                    label="Reporter Password"
                    placeholder="Enter your password"
                    description="Used to verify your identity."
                  />

                  {/* Number input */}
                  <InputController
                    name="affectedUsers"
                    form={form}
                    type="number"
                    label="Affected Users"
                    placeholder="e.g. 42"
                    description="Approximate number of users affected by this bug."
                    min={1}
                  />

                  {/* Textarea */}
                  <TextareaController
                    name="description"
                    form={form}
                    label="Description"
                    placeholder="I'm having an issue with the login button on mobile."
                    description="Include steps to reproduce, expected behavior, and what happened."
                    rows={4}
                    className="resize-none"
                  />

                  {/* Select */}
                  <SelectController
                    name="severity"
                    form={form}
                    label="Severity"
                    placeholder="Select severity"
                    options={severityOptions}
                    description="How critical is this bug?"
                  />

                  {/* Radio group */}
                  <RadioGroupController
                    name="platform"
                    form={form}
                    label="Platform"
                    options={platformOptions}
                    description="Which platform is affected?"
                  />

                  {/* Combobox */}
                  <ComboboxController
                    name="assignee"
                    form={form}
                    label="Assignee"
                    placeholder="Search team members..."
                    options={assigneeOptions}
                    description="Who should fix this bug?"
                  />

                  {/* Slider */}
                  <SliderController
                    name="priority"
                    form={form}
                    label="Priority Score"
                    min={0}
                    max={100}
                    step={5}
                    description="Drag to set a priority score from 0 to 100."
                  />

                  {/* OTP */}
                  <InputOTPController
                    name="otp"
                    form={form}
                    label="Verification Code"
                    maxLength={6}
                    description="Enter the 6-digit code sent to your email."
                  />

                  {/* File Uploader */}
                  <FileUploaderController
                    name="attachments"
                    form={form}
                    label="Attachments"
                    description="Upload screenshots or logs to help reproduce the bug."
                    multiple
                    maxSize={5 * 1024 * 1024}
                    extensions={['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.txt', '.log']}
                  />

                  {/* Checkbox */}
                  <CheckboxController name="reproducible" form={form} label="I can reproduce this bug consistently" />

                  {/* Switch */}
                  <SwitchController name="notify" form={form} label="Notify me when this bug is resolved" />
                </FieldGroup>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <Field orientation="horizontal">
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Reset
              </Button>
              <Button type="submit" form="form-rhf-demo">
                Submit
              </Button>
            </Field>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
