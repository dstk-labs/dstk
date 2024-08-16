import { forwardRef } from 'react';
import { Value } from '@radix-ui/react-select';

export type SelectValueProps = React.ComponentPropsWithoutRef<typeof Value>;

export const SelectValue = forwardRef<React.ElementRef<typeof Value>, SelectValueProps>(
    ({ children, className, ...props }, ref) => (
        <Value className={className} ref={ref} {...props}>
            {children}
        </Value>
    ),
);
SelectValue.displayName = Value.displayName;
