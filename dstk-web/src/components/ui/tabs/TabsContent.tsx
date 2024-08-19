import React, { forwardRef } from 'react';
import { Content, type TabsContentProps as ContentProps } from '@radix-ui/react-tabs';

import { cn } from '@/lib';

export type TabsContentProps = React.PropsWithChildren<ContentProps>;

export const TabsContent = forwardRef<React.ElementRef<typeof Content>, TabsContentProps>(
    ({ children, className, ...props }, ref) => {
        return (
            <Content
                className={cn(
                    // base
                    'focus:ring-2 outline-none',
                    // ring color
                    'focus:ring-blue-200 focus:dark:ring-blue-700/30',
                    // border color
                    'focus:border-blue-500 focus:dark:border-blue-700',
                    className,
                )}
                ref={ref}
                {...props}
            >
                {children}
            </Content>
        );
    },
);
TabsContent.displayName = 'TabsContent';
