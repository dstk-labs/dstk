import { cn } from '@/lib';
import { forwardRef } from 'react';

export const TableBody = forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, forwardedRef) => (
    <tbody
        ref={forwardedRef}
        className={cn(
            // base
            'divide-y',
            // divide color
            'divide-gray-200 dark:divide-gray-800',
            className,
        )}
        {...props}
    />
));
TableBody.displayName = 'TableBody';
