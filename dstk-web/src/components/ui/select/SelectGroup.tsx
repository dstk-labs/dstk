import { forwardRef } from 'react';
import { Group } from '@radix-ui/react-select';

export type SelectGroupProps = React.ComponentPropsWithoutRef<typeof Group>;

export const SelectGroup = forwardRef<React.ElementRef<typeof Group>, SelectGroupProps>(
    ({ children, className, ...props }, ref) => (
        <Group className={className} ref={ref} {...props}>
            {children}
        </Group>
    ),
);
SelectGroup.displayName = Group.displayName;
