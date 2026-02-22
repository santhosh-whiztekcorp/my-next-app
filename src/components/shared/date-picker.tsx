'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar, type CalendarProps } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface DatePickerProps {
  date?: Date;
  setDate?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  enableTimePicker?: boolean;
  calendarProps?: Omit<CalendarProps, 'mode' | 'selected' | 'onSelect'>;
  showClear?: boolean;
  classNames?: {
    trigger?: string;
    content?: string;
    calendar?: string;
    clearButton?: string;
  };
}

export function DatePicker({
  date,
  setDate,
  placeholder = 'Pick a date',
  className,
  enableTimePicker = false,
  calendarProps,
  showClear = true,
  classNames,
}: DatePickerProps) {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(date);

  React.useEffect(() => {
    setInternalDate(date);
  }, [date]);

  const handleSelect = (newDate: Date | undefined) => {
    setInternalDate(newDate);
    setDate?.(newDate);
  };

  const clearDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleSelect(undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'data-[empty=true]:text-muted-foreground group hover:border-primary/50 relative w-[300px] justify-start text-left font-normal transition-all duration-200',
            !internalDate && 'text-muted-foreground',
            className,
            classNames?.trigger,
          )}
        >
          {enableTimePicker ? (
            <Clock className="text-primary h-4 w-4" />
          ) : (
            <CalendarIcon className="text-primary h-4 w-4" />
          )}

          <span className="flex-1 truncate">
            {internalDate ? format(internalDate, enableTimePicker ? 'PPP p' : 'PPP') : <span>{placeholder}</span>}
          </span>

          {showClear && internalDate && (
            <X
              className={cn(
                'hover:text-destructive ml-2 h-3 w-3 opacity-0 transition-all group-hover:opacity-100',
                classNames?.clearButton,
              )}
              onClick={clearDate}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn('w-auto border-none bg-transparent p-0 shadow-none', classNames?.content)}
        align="start"
      >
        <Calendar
          mode="single"
          selected={internalDate}
          onSelect={handleSelect}
          enableTimePicker={enableTimePicker}
          className={classNames?.calendar}
          {...calendarProps}
        />
      </PopoverContent>
    </Popover>
  );
}
