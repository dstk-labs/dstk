import * as LabelPrimitives from '@radix-ui/react-label';
import { cn } from '@/lib';
import { forwardRef } from 'react';

export type LabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitives.Root> & {
    disabled?: boolean;
};

export const Label = forwardRef<React.ElementRef<typeof LabelPrimitives.Root>, LabelProps>(
    ({ className, disabled, ...props }, forwardedRef) => (
        <LabelPrimitives.Root
            ref={forwardedRef}
            className={cn(
                // base
                'text-sm leading-none',
                // text color
                'text-gray-900 dark:text-gray-50',
                // disabled
                {
                    'text-gray-400 dark:text-gray-600': disabled,
                },
                className,
            )}
            aria-disabled={disabled}
            {...props}
        />
    ),
);
Label.displayName = 'Label';
