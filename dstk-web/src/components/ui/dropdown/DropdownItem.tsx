import { forwardRef } from 'react';
import { Item, type MenuItemProps } from '@radix-ui/react-dropdown-menu';

import { cn } from '@/lib';

export type DropdownItemProps = MenuItemProps & { inset?: boolean };

export const DropdownItem = forwardRef<
    React.ElementRef<typeof Item>,
    MenuItemProps & { inset?: boolean }
>(({ children, className, inset, ...props }, ref) => {
    return (
        <Item
            className={cn(
                //base
                'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                // text color
                'text-gray-900 dark:text-white',
                // focus
                'focus:bg-gray-50 dark:focus:bg-gray-800',
                // disabled
                'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                inset && 'pl-8',
                className,
            )}
            ref={ref}
            {...props}
        >
            {children}
        </Item>
    );
});
DropdownItem.displayName = 'DropdownItem';
