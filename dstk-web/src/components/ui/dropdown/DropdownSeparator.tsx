import { cn } from '@/lib';
import { Separator, type DropdownMenuSeparatorProps } from '@radix-ui/react-dropdown-menu';
import { forwardRef } from 'react';

export type DropdownSeparatorProps = DropdownMenuSeparatorProps;

export const DropdownSeparator = forwardRef<
    React.ElementRef<typeof Separator>,
    DropdownSeparatorProps
>(({ className, ...props }, forwardedRef) => (
    <Separator
        ref={forwardedRef}
        className={cn('-mx-1 my-1 h-px border-t border-gray-200 dark:border-gray-800', className)}
        {...props}
    />
));
DropdownSeparator.displayName = 'DropdownSeparator';
