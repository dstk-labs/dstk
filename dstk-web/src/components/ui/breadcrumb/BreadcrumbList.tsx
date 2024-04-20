import { forwardRef } from 'react';

import { cn } from '@/lib';

export type BreadcrumbListProps = React.ComponentPropsWithoutRef<'ol'>;

export const BreadcrumbList = forwardRef<HTMLOListElement, BreadcrumbListProps>(
    ({ children, className, ...props }, ref) => {
        return (
            <ol
                className={cn(
                    'flex flex-wrap items-center gap-1.5 break-words text-sm text-gray-500 sm:gap-2.5',
                    className,
                )}
                ref={ref}
                {...props}
            >
                {children}
            </ol>
        );
    },
);
BreadcrumbList.displayName = 'BreadcrumbList';
