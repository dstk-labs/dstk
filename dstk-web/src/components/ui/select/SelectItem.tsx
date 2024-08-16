import { forwardRef } from 'react';
import { Item, ItemIndicator, ItemText } from '@radix-ui/react-select';
import { RiCheckLine } from '@remixicon/react';
import { cn } from '@/lib';

export const SelectItem = forwardRef<
    React.ElementRef<typeof Item>,
    React.ComponentPropsWithoutRef<typeof Item>
>(({ className, children, ...props }, forwardedRef) => {
    return (
        <Item
            ref={forwardedRef}
            className={cn(
                // base
                'grid cursor-pointer grid-cols-[1fr_20px] gap-x-2 rounded px-3 py-2 outline-none transition-colors data-[state=checked]:font-semibold sm:text-sm',
                // text color
                'text-gray-900 dark:text-gray-50',
                // disabled
                'data-[disabled]:pointer-events-none data-[disabled]:text-gray-400 data-[disabled]:hover:bg-none dark:data-[disabled]:text-gray-600',
                // focus
                'focus-visible:bg-gray-100 focus-visible:dark:bg-gray-900',
                // hover
                'hover:bg-gray-100 hover:dark:bg-gray-900',
                className,
            )}
            {...props}
        >
            <ItemText className='flex-1 truncate'>{children}</ItemText>
            <ItemIndicator>
                <RiCheckLine
                    className='size-5 shrink-0 text-gray-800 dark:text-gray-200'
                    aria-hidden='true'
                />
            </ItemIndicator>
        </Item>
    );
});

SelectItem.displayName = 'SelectItem';
