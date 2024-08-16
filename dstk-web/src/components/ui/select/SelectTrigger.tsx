import { forwardRef } from 'react';
import { Icon, Trigger } from '@radix-ui/react-select';
import { RiExpandUpDownLine } from '@remixicon/react';

import { cn } from '@/lib';

export type SelectTriggerProps = React.ComponentPropsWithoutRef<typeof Trigger> & {
    hasError?: boolean;
};

export const selectTriggerStyles = cn(
    // base
    'group/trigger flex w-full select-none items-center justify-between truncate rounded-md border px-3 py-2 shadow-sm outline-none transition sm:text-sm',
    // border color
    'border-gray-300 dark:border-gray-800',
    // text color
    'text-gray-900 dark:text-gray-50',
    // placeholder
    'data-[placeholder]:text-gray-400 data-[placeholder]:dark:text-gray-500',
    // background color
    'bg-white dark:bg-gray-950',
    // hover
    'hover:bg-gray-50 hover:dark:bg-gray-950/50',
    // disabled
    'data-[disabled]:bg-gray-100 data-[disabled]:text-gray-400',
    'data-[disabled]:dark:border-gray-700 data-[disabled]:dark:bg-gray-800 data-[disabled]:dark:text-gray-500',
);

export const SelectTrigger = forwardRef<React.ElementRef<typeof Trigger>, SelectTriggerProps>(
    ({ className, hasError, children, ...props }, ref) => {
        return (
            <Trigger
                className={cn(
                    selectTriggerStyles,
                    hasError &&
                        'ring-2 border-red-500 dark:border-red-700 ring-red-200 dark:ring-red-700/30',
                    className,
                )}
                ref={ref}
                {...props}
            >
                <span className='truncate'>{children}</span>
                <Icon asChild>
                    <RiExpandUpDownLine
                        className={cn(
                            // base
                            'size-4 shrink-0',
                            // text color
                            'text-gray-400 dark:text-gray-600',
                            // disabled
                            'group-data-[disabled]/trigger:text-gray-300 group-data-[disabled]/trigger:dark:text-gray-600',
                        )}
                    />
                </Icon>
            </Trigger>
        );
    },
);
SelectTrigger.displayName = 'SelectTrigger';
