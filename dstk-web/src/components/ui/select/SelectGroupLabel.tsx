import { forwardRef } from 'react';
import { Label } from '@radix-ui/react-select';

import { cn } from '@/lib';

export type SelectGroupLabelProps = React.ComponentPropsWithoutRef<typeof Label>;

const SelectGroupLabel = forwardRef<React.ElementRef<typeof Label>, SelectGroupLabelProps>(
    ({ className, ...props }, ref) => (
        <Label
            className={cn(
                // base
                'px-3 py-2 text-xs font-medium tracking-wide',
                // text color
                ' text-gray-500 dark:text-gray-500',
                className,
            )}
            ref={ref}
            {...props}
        />
    ),
);

SelectGroupLabel.displayName = 'SelectGroupLabel';
