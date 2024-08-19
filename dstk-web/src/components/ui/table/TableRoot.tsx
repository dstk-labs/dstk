import { forwardRef } from 'react';

import { cn } from '@/lib';

export type TableRootProps = React.HTMLAttributes<HTMLDivElement>;

export const TableRoot = forwardRef<HTMLDivElement, TableRootProps>(
    ({ children, className, ...props }, ref) => (
        <div ref={ref}>
            <div className={cn('w-full overflow-auto whitespace-nowrap', className)} {...props}>
                {children}
            </div>
        </div>
    ),
);
TableRoot.displayName = 'TableRoot';
