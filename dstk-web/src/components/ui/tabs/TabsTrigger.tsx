import { forwardRef, useContext } from 'react';
import { Trigger } from '@radix-ui/react-tabs';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib';

import { TabsListVariantContext } from './TabsList';

export type TabsTriggerProps = React.ComponentPropsWithoutRef<typeof Trigger>;

export const tabsTriggerVariants = cva(
    cn(
        // base
        'items-center justify-center whitespace-nowrap px-3 text-sm font-medium transition-all outline outline-offset-2 outline-0 focus-visible:outline-2',
        // text color
        'text-gray-500',
        // hover
        'hover:text-gray-700',
        // outline color
        'outline-blue-500 dark:outline-blue-500',
        // selected
        'data-[state=active]:text-gray-900 data-[state=active]:dark:text-gray-50',
        // disabled
        'disabled:pointer-events-none',
    ),
    {
        variants: {
            variant: {
                line: cn(
                    // base
                    '-mb-px border-b-2 border-transparent pb-3',
                    // text color
                    'dark:text-gray-500',
                    // hover
                    'hover:dark:text-gray-400',
                    // border hover
                    'hover:border-gray-300 hover:dark:border-gray-400',
                    // selected
                    'data-[state=active]:border-gray-900',
                    'data-[state=active]:dark:border-gray-50',
                    // disabled
                    'disabled:text-gray-300 disabled:dark:text-gray-700',
                ),
                solid: cn(
                    // base
                    'inline-flex rounded py-1',
                    // text color
                    'dark:text-gray-400',
                    // hover
                    'hover:dark:text-gray-200',
                    // selected
                    'data-[state=active]:bg-white data-[state=active]:shadow',
                    'data-[state=active]:dark:bg-gray-900',
                    // disabled
                    ' disabled:text-gray-400 disabled:dark:text-gray-600 disabled:opacity-50',
                ),
            },
        },
        defaultVariants: {
            variant: 'line',
        },
    },
);

export const TabsTrigger = forwardRef<React.ElementRef<typeof Trigger>, TabsTriggerProps>(
    ({ className, children, ...props }, forwardedRef) => {
        const variant = useContext(TabsListVariantContext);
        return (
            <Trigger
                ref={forwardedRef}
                className={cn(tabsTriggerVariants({ variant, className }))}
                {...props}
            >
                {children}
            </Trigger>
        );
    },
);
TabsTrigger.displayName = 'TabsTrigger';
