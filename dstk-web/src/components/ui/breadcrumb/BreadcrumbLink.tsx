import { forwardRef } from 'react';
import { Link } from 'react-router-dom';

import { cn } from '@/lib';

export type BreadcrumbLinkProps = React.ComponentPropsWithoutRef<typeof Link>;

export const BreadcrumbLink = forwardRef<React.ElementRef<typeof Link>, BreadcrumbLinkProps>(
    ({ children, className, ...props }, ref) => {
        return (
            <Link
                className={cn(
                    'transition-colors hover:text-gray-900 dark:hover:text-gray-50',
                    className,
                )}
                ref={ref}
                {...props}
            >
                {children}
            </Link>
        );
    },
);
BreadcrumbLink.displayName = 'BreadcrumbLink';
