import { forwardRef } from 'react';
import { ScrollUpButton } from '@radix-ui/react-select';
import { RiArrowUpSLine } from '@remixicon/react';

import { cn } from '@/lib';

export type SelectScrollUpButtonProps = React.ComponentPropsWithoutRef<typeof ScrollUpButton>;

export const SelectScrollUpButton = forwardRef<
    React.ElementRef<typeof ScrollUpButton>,
    SelectScrollUpButtonProps
>(({ className, ...props }, ref) => (
    <ScrollUpButton
        className={cn('flex cursor-default items-center justify-center py-1', className)}
        ref={ref}
        {...props}
    >
        <RiArrowUpSLine className='size-3 shrink-0' aria-hidden='true' />
    </ScrollUpButton>
));
SelectScrollUpButton.displayName = ScrollUpButton.displayName;
