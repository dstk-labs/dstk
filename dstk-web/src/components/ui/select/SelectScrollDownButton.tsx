import { forwardRef } from 'react';
import { ScrollDownButton } from '@radix-ui/react-select';
import { RiArrowDownSLine } from '@remixicon/react';

import { cn } from '@/lib';

export type SelectScrollDownButtonProps = React.ComponentPropsWithoutRef<typeof ScrollDownButton>;

export const SelectScrollDownButton = forwardRef<
    React.ElementRef<typeof ScrollDownButton>,
    SelectScrollDownButtonProps
>(({ className, ...props }, forwardedRef) => (
    <ScrollDownButton
        ref={forwardedRef}
        className={cn('flex cursor-default items-center justify-center py-1', className)}
        {...props}
    >
        <RiArrowDownSLine className='size-3 shrink-0' aria-hidden='true' />
    </ScrollDownButton>
));
SelectScrollDownButton.displayName = ScrollDownButton.displayName;
