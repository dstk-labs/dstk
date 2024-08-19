import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib';

export type CardProps = React.ComponentPropsWithoutRef<'div'> & {
    asChild?: boolean;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, asChild, ...props }, forwardedRef) => {
        const Component = asChild ? Slot : 'div';
        return (
            <Component
                ref={forwardedRef}
                className={cn(
                    // base
                    'relative w-full rounded-lg border p-6 text-left shadow-sm',
                    // background color
                    'bg-white dark:bg-[#090E1A]',
                    // border color
                    'border-gray-200 dark:border-gray-900',
                    className,
                )}
                {...props}
            />
        );
    },
);
Card.displayName = 'Card';
