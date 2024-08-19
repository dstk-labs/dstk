import { cn } from '@/lib';
import { forwardRef } from 'react';

export const TableCell = forwardRef<
    HTMLTableCellElement,
    React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, forwardedRef) => (
    <td
        ref={forwardedRef}
        className={cn(
            // base
            'p-4 text-sm',
            // text color
            'text-gray-600 dark:text-gray-400',
            className,
        )}
        {...props}
    />
));

TableCell.displayName = 'TableCell';
