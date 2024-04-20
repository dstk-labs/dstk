import { forwardRef } from 'react';

import { cn } from '@/lib';

export type BreadcrumbPageProps = React.ComponentPropsWithoutRef<'span'>;

export const BreadcrumbPage = forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
    ({ children, className, ...props }, ref) => {
        return (
            <span
                aria-current='page'
                aria-disabled='true'
                className={cn('font-normal text-gray-900 dark:text-gray-50', className)}
                ref={ref}
                role='link'
                {...props}
            >
                {children}
            </span>
        );
    },
);
BreadcrumbPage.displayName = 'BreadcrumbPage';
