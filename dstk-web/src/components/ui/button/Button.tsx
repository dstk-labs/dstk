import React, { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { RiLoader2Fill } from '@remixicon/react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib';

export const buttonVariants = cva(
    cn(
        // base
        'relative inline-flex items-center justify-center border text-center font-medium shadow-sm transition-all duration-100 ease-in-out',
        // disabled
        'disabled:pointer-events-none disabled:shadow-none',
        // focus
        'outline outline-blue-500 outline-offset-2 outline-0 focus-visible:outline-2',
    ),
    {
        variants: {
            variant: {
                primary: cn(
                    // border
                    'border-transparent',
                    // text color
                    'text-white dark:text-gray-900',
                    // background color
                    'bg-gray-900 dark:bg-gray-50',
                    // hover color
                    'hover:bg-gray-800 dark:hover:bg-gray-200',
                    // disabled
                    'disabled:bg-gray-100 disabled:text-gray-400',
                    'disabled:dark:bg-gray-800 disabled:dark:text-gray-600',
                ),
                secondary: cn(
                    // border
                    'border-gray-300 dark:border-gray-800',
                    // text color
                    'text-gray-900 dark:text-gray-50',
                    // background color
                    ' bg-white dark:bg-gray-950',
                    //hover color
                    'hover:bg-gray-50 dark:hover:bg-gray-900/60',
                    // disabled
                    'disabled:text-gray-400',
                    'disabled:dark:text-gray-600',
                ),
                light: cn(
                    // base
                    'shadow-none',
                    // border
                    'border-transparent',
                    // text color
                    'text-gray-900 dark:text-gray-50',
                    // background color
                    'bg-gray-200 dark:bg-gray-900',
                    // hover color
                    'hover:bg-gray-300/70 dark:hover:bg-gray-800/80',
                    // disabled
                    'disabled:bg-gray-100 disabled:text-gray-400',
                    'disabled:dark:bg-gray-800 disabled:dark:text-gray-600',
                ),
                destructive: cn(
                    // text color
                    'text-white',
                    // border
                    'border-transparent',
                    // background color
                    'bg-red-600 dark:bg-red-700',
                    // hover color
                    'hover:bg-red-700 dark:hover:bg-red-600',
                    // disabled
                    'disabled:bg-red-300 disabled:text-white',
                    'disabled:dark:bg-red-950 disabled:dark:text-red-400',
                ),
            },
            size: {
                xs: 'rounded px-2 py-1 text-xs',
                sm: 'rounded px-2 py-1 text-sm',
                md: 'rounded-md px-3 py-1.5 text-sm',
                lg: 'rounded-md px-3 py-2 text-sm',
                xl: 'rounded-md px-3.5 py-2.5 text-sm',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    },
);

export type ButtonProps = React.ComponentPropsWithoutRef<'button'> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
        isLoading?: boolean;
    };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            asChild,
            children,
            className,
            disabled,
            isLoading = false,
            size,
            variant,
            ...props
        }: ButtonProps,
        forwardedRef,
    ) => {
        const Component = asChild ? Slot : 'button';
        return (
            <Component
                ref={forwardedRef}
                className={cn(buttonVariants({ size, variant }), className)}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <span className='pointer-events-none flex shrink-0 items-center justify-center gap-1.5'>
                        <RiLoader2Fill
                            className='size-4 shrink-0 animate-spin'
                            aria-hidden='true'
                        />
                        {children}
                    </span>
                ) : (
                    children
                )}
            </Component>
        );
    },
);
Button.displayName = 'Button';
