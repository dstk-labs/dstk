import { forwardRef } from 'react';
import { Fallback } from '@radix-ui/react-avatar';

import { cn } from '@/lib';

export type AvatarFallbackProps = React.ComponentPropsWithoutRef<typeof Fallback>;

export const AvatarFallback = forwardRef<React.ElementRef<typeof Fallback>, AvatarFallbackProps>(
    ({ className, ...props }, ref) => (
        <Fallback
            className={cn(
                'text-sm text-gray-900 dark:text-gray-50 flex h-full w-full items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800/80',
                className,
            )}
            ref={ref}
            {...props}
        />
    ),
);
AvatarFallback.displayName = Fallback.displayName;
