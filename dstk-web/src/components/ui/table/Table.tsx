import { cn } from '@/lib';
import { forwardRef } from 'react';

export const Table = forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(
    ({ className, ...props }, forwardedRef) => (
        <table
            ref={forwardedRef}
            className={cn(
                // base
                'w-full caption-bottom border-b',
                // border color
                'border-gray-200 dark:border-gray-800',
                className,
            )}
            {...props}
        />
    ),
);
Table.displayName = 'Table';
