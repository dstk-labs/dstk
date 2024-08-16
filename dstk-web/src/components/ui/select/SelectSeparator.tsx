import { forwardRef } from 'react';
import { Separator } from '@radix-ui/react-select';

import { cn } from '@/lib';

export type SelectSeparatorProps = React.ComponentPropsWithoutRef<typeof Separator>;

export const SelectSeparator = forwardRef<React.ElementRef<typeof Separator>, SelectSeparatorProps>(
    ({ className, ...props }, forwardedRef) => (
        <Separator
            ref={forwardedRef}
            className={cn(
                // base
                '-mx-1 my-1 h-px',
                // background color
                'bg-gray-300 dark:bg-gray-700',
                className,
            )}
            {...props}
        />
    ),
);

SelectSeparator.displayName = 'SelectSeparator';
