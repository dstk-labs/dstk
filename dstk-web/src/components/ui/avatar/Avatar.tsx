import { forwardRef } from 'react';
import { Root } from '@radix-ui/react-avatar';

import { cn } from '@/lib';

export type AvatarProps = React.ComponentPropsWithoutRef<typeof Root>;

export const Avatar = forwardRef<React.ElementRef<typeof Root>, AvatarProps>(
    ({ children, className, ...props }, ref) => (
        <Root
            className={cn('relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full', className)}
            ref={ref}
            {...props}
        >
            {children}
        </Root>
    ),
);
Avatar.displayName = Root.displayName;
