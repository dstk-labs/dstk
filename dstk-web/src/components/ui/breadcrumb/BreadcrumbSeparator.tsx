import { RiArrowRightSLine } from '@remixicon/react';

import { cn } from '@/lib';

export type BreadcrumbSeparatorProps = React.ComponentProps<'li'>;

export const BreadcrumbSeparator = ({
    children,
    className,
    ...props
}: BreadcrumbSeparatorProps) => {
    return (
        <li
            aria-hidden='true'
            className={cn('[&>svg]:size-3.5', className)}
            role='presentation'
            {...props}
        >
            {children ?? <RiArrowRightSLine />}
        </li>
    );
};
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';
