import { cn } from '@/lib';
import { forwardRef } from 'react';

export const TableRow = forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
    ({ className, ...props }, forwardedRef) => (
        <tr
            ref={forwardedRef}
            className={cn(
                '[&_td:last-child]:pr-4 [&_th:last-child]:pr-4',
                '[&_td:first-child]:pl-4 [&_th:first-child]:pl-4',
                className,
            )}
            {...props}
        />
    ),
);

TableRow.displayName = 'TableRow';
