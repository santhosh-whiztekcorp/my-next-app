'use client';

import * as React from 'react';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { DayPicker, getDefaultClassNames, type DayButton } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
  enableTimePicker?: boolean;
  disablePastDates?: boolean;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  disablePastDates = false,
  enableTimePicker = false,
  formatters,
  components,
  ...props
}: CalendarProps) {
  const { selected, onSelect } = props as {
    selected?: Date;
    onSelect?: (date: Date | undefined, ...args: unknown[]) => void;
  };
  const defaultClassNames = getDefaultClassNames();

  const selectedDate = (selected as Date | undefined) || new Date();
  const [hour, setHour] = React.useState(() => {
    const h = selectedDate.getHours();
    return h === 0 ? 12 : h > 12 ? h - 12 : h;
  });
  const [minute, setMinute] = React.useState(selectedDate.getMinutes());
  const [ampm, setAmpm] = React.useState(selectedDate.getHours() >= 12 ? 'PM' : 'AM');

  const handleTimeChange = (type: 'hour' | 'minute' | 'ampm', value: number | string) => {
    let newHour = hour;
    let newMinute = minute;
    let newAmpm = ampm;

    if (type === 'hour' && typeof value === 'number') newHour = value;
    if (type === 'minute' && typeof value === 'number') newMinute = value;
    if (type === 'ampm' && typeof value === 'string') newAmpm = value;

    setHour(newHour);
    setMinute(newMinute);
    setAmpm(newAmpm);

    if (onSelect && selected instanceof Date) {
      const newDate = new Date(selected);
      let h = newHour;
      if (newAmpm === 'PM' && h < 12) h += 12;
      if (newAmpm === 'AM' && h === 12) h = 0;
      newDate.setHours(h, newMinute);
      onSelect?.(newDate);
    }
  };

  const handleDateSelect = (date: Date | undefined, ...args: unknown[]) => {
    if (date instanceof Date && enableTimePicker) {
      let h = hour;
      if (ampm === 'PM' && h < 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      date.setHours(h, minute);
    }
    if (onSelect) {
      onSelect(date, ...args);
    }
  };

  const disabledDays = props.disabled;
  const mergedDisabled = disablePastDates
    ? disabledDays
      ? Array.isArray(disabledDays)
        ? [...disabledDays, { before: new Date() }]
        : [disabledDays, { before: new Date() }]
      : { before: new Date() }
    : disabledDays;

  return (
    <div
      className={cn(
        'border-border/50 bg-background/50 w-fit overflow-hidden rounded-xl border shadow-2xl backdrop-blur-md',
        className,
      )}
    >
      {/* eslint-disable @typescript-eslint/no-explicit-any */}
      <DayPicker
        {...(props as any)}
        selected={selected as any}
        onSelect={handleDateSelect as any}
        showOutsideDays={showOutsideDays}
        className={cn(
          'group/calendar p-3 [--cell-size:--spacing(8)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent',
          String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
          String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        )}
        captionLayout={captionLayout}
        formatters={{
          formatMonthDropdown: (date) => date.toLocaleString('default', { month: 'short' }),
          ...formatters,
        }}
        classNames={{
          root: cn('w-fit', defaultClassNames.root),
          months: cn('flex gap-6 flex-col md:flex-row relative', defaultClassNames.months),
          month: cn('flex flex-col w-full gap-5', defaultClassNames.month),
          nav: cn('flex items-center justify-between absolute inset-x-0 top-0 z-10', defaultClassNames.nav),
          button_previous: cn(
            buttonVariants({ variant: buttonVariant }),
            'size-(--cell-size) border border-border/50 aria-disabled:opacity-20 p-0 select-none transition-all active:scale-95',
            defaultClassNames.button_previous,
          ),
          button_next: cn(
            buttonVariants({ variant: buttonVariant }),
            'size-(--cell-size) border border-border/50 aria-disabled:opacity-20 p-0 select-none transition-all active:scale-95',
            defaultClassNames.button_next,
          ),
          month_caption: cn(
            'flex items-start justify-center h-(--cell-size) w-full mb-2',
            defaultClassNames.month_caption,
          ),
          dropdowns: cn(
            'flex items-center text-sm font-medium justify-start h-(--cell-size) gap-2',
            defaultClassNames.dropdowns,
          ),
          dropdown_root: cn(
            'relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md transition-all duration-200 hover:border-primary/50',
            defaultClassNames.dropdown_root,
          ),
          dropdown: cn('absolute bg-popover inset-0 opacity-0', defaultClassNames.dropdown),
          caption_label: cn(
            'select-none font-medium',
            captionLayout === 'label'
              ? 'text-sm'
              : 'rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5',
            defaultClassNames.caption_label,
          ),
          table: 'w-full border-collapse',
          weekdays: cn('flex', defaultClassNames.weekdays),
          weekday: cn(
            'text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none',
            defaultClassNames.weekday,
          ),
          week: cn('flex w-full mt-2', defaultClassNames.week),
          week_number_header: cn('select-none w-(--cell-size)', defaultClassNames.week_number_header),
          week_number: cn('text-[0.8rem] select-none text-muted-foreground', defaultClassNames.week_number),
          day: cn(
            'relative w-full h-full p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none',
            props.showWeekNumber
              ? '[&:nth-child(2)[data-selected=true]_button]:rounded-l-md'
              : '[&:first-child[data-selected=true]_button]:rounded-l-md',
            defaultClassNames.day,
          ),
          range_start: cn('rounded-l-md bg-accent', defaultClassNames.range_start),
          range_middle: cn('rounded-none', defaultClassNames.range_middle),
          range_end: cn('rounded-r-md bg-accent', defaultClassNames.range_end),
          today: cn(
            'bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none',
            defaultClassNames.today,
          ),
          outside: cn('text-muted-foreground aria-selected:text-muted-foreground', defaultClassNames.outside),
          disabled: cn('text-muted-foreground opacity-50', defaultClassNames.disabled),
          hidden: cn('invisible', defaultClassNames.hidden),
          ...classNames,
        }}
        components={{
          Root: ({ className, rootRef, ...props }) => {
            return <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />;
          },
          Chevron: ({ className, orientation, ...props }) => {
            if (orientation === 'left') {
              return <ChevronLeftIcon className={cn('size-4', className)} {...props} />;
            }

            if (orientation === 'right') {
              return <ChevronRightIcon className={cn('size-4', className)} {...props} />;
            }

            return <ChevronDownIcon className={cn('size-4', className)} {...props} />;
          },
          DayButton: CalendarDayButton,
          WeekNumber: ({ children, ...props }) => {
            return (
              <td {...props}>
                <div className="flex size-(--cell-size) items-center justify-center text-center">{children}</div>
              </td>
            );
          },
          ...components,
        }}
        {...props}
        disabled={mergedDisabled}
      />
      {enableTimePicker && (
        <div className="border-border/50 bg-accent/5 flex w-full items-center justify-between gap-4 border-t px-4 py-3 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="group/time relative">
                <div className="border-input bg-background/50 hover:border-primary/50 flex h-8 min-w-10 items-center justify-between rounded-md border px-2 text-sm font-medium transition-colors">
                  <span className="tabular-nums">{hour.toString().padStart(2, '0')}</span>
                  <ChevronDownIcon className="size-3 opacity-50" />
                </div>
                <select
                  value={hour}
                  onChange={(e) => handleTimeChange('hour', parseInt(e.target.value))}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                    <option key={h} value={h} className="bg-background text-foreground">
                      {h.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
              <span className="text-muted-foreground/30 font-medium">:</span>
              <div className="group/time relative">
                <div className="border-input bg-background/50 hover:border-primary/50 flex h-8 min-w-10 items-center justify-between rounded-md border px-2 text-sm font-medium transition-colors">
                  <span className="tabular-nums">{minute.toString().padStart(2, '0')}</span>
                  <ChevronDownIcon className="size-3 opacity-50" />
                </div>
                <select
                  value={minute}
                  onChange={(e) => handleTimeChange('minute', parseInt(e.target.value))}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                >
                  {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                    <option key={m} value={m} className="bg-background text-foreground">
                      {m.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-secondary/30 border-border/50 flex rounded-lg border p-0.5">
            {['AM', 'PM'].map((mode) => (
              <button
                key={mode}
                onClick={() => handleTimeChange('ampm', mode)}
                className={cn(
                  'rounded-md px-2.5 py-1 text-[10px] font-bold transition-all',
                  ampm === mode
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-black/5',
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CalendarDayButton({ className, day, modifiers, ...props }: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        'data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-accent-foreground hover:bg-primary/10 data-[selected-single=true]:hover:bg-primary/90 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal transition-all duration-300 group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] hover:z-20 hover:scale-110 hover:shadow-lg active:scale-95 aria-disabled:opacity-20 aria-disabled:grayscale data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md data-[selected-single=true]:shadow-[0_0_20px_rgba(var(--primary),0.3)] [&>span]:text-xs [&>span]:opacity-70',
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
