import { RiMoreLine } from '@remixicon/react';

import { cn } from '@/lib';

export type BreadcrumbElipssisProps = Omit<React.ComponentProps<'span'>, 'children'>;

export const BreadcrumbElipssis = ({ className, ...props }: BreadcrumbElipssisProps) => {
    return (
        <span
            aria-hidden='true'
            className={cn('flex h-9 w-9 items-center justify-center', className)}
            role='presentation'
            {...props}
        >
            <RiMoreLine className='h-4 w-4' />
            <span className='sr-only'>More</span>
        </span>
    );
};
BreadcrumbElipssis.displayName = 'BreadcrumbElipssis';
