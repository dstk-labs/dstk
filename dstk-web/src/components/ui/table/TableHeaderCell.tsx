import { cn } from '@/lib';
import { forwardRef } from 'react';

export const TableHeaderCell = forwardRef<
    HTMLTableCellElement,
    React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, forwardedRef) => (
    <th
        ref={forwardedRef}
        className={cn(
            // base
            'border-b px-4 py-3.5 text-left text-sm font-semibold',
            // text color
            'text-gray-900 dark:text-gray-50',
            // border color
            'border-gray-200 dark:border-gray-800',
            className,
        )}
        {...props}
    />
));
TableHeaderCell.displayName = 'TableHeaderCell';
