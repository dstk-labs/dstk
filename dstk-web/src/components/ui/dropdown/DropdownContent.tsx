import { forwardRef } from 'react';
import { Content, Portal, type MenuContentProps } from '@radix-ui/react-dropdown-menu';

import { cn } from '@/lib';

export type DropdownContentProps = MenuContentProps;

export const DropdownContent = forwardRef<React.ElementRef<typeof Content>, MenuContentProps>(
    ({ children, className, sideOffset = 4, ...props }, ref) => {
        return (
            <Portal>
                <Content
                    className={cn(
                        // base
                        'max-h-[var(--radix-popper-available-height)] min-w-60 overflow-hidden rounded-md border p-2.5 text-sm shadow-md',
                        // border color
                        'border-gray-300 dark:border-gray-800',
                        // text color
                        'text-gray-900 dark:text-gray-50',
                        // background color
                        'bg-white dark:bg-gray-950',
                        // transition
                        'will-change-[transform,opacity]',
                        'data-[state=closed]:animate-hide',
                        'data-[state=open]:data-[side=bottom]:animate-slideDownAndFade data-[state=open]:data-[side=left]:animate-slideLeftAndFade data-[state=open]:data-[side=right]:animate-slideRightAndFade data-[state=open]:data-[side=top]:animate-slideUpAndFade',
                        className,
                    )}
                    sideOffset={sideOffset}
                    ref={ref}
                    {...props}
                >
                    {children}
                </Content>
            </Portal>
        );
    },
);
DropdownContent.displayName = 'DropdownContent';
