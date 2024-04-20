import { forwardRef } from 'react';

import { cn } from '@/lib';

export type BreadcrumbItemProps = React.ComponentPropsWithoutRef<'li'>;

export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
    ({ children, className, ...props }, ref) => {
        return (
            <li className={cn('inline-flex items-center gap-1.5', className)} ref={ref} {...props}>
                {children}
            </li>
        );
    },
);
BreadcrumbItem.displayName = 'BreadcrumbItem';
