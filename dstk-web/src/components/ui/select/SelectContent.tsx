import { forwardRef } from 'react';
import { Content, Portal, Viewport } from '@radix-ui/react-select';

import { cn } from '@/lib';

import { SelectScrollDownButton } from './SelectScrollDownButton';
import { SelectScrollUpButton } from './SelectScrollUpButton';

export type SelectContentProps = React.ComponentPropsWithoutRef<typeof Content>;

export const SelectContent = forwardRef<React.ElementRef<typeof Content>, SelectContentProps>(
    (
        {
            className,
            position = 'popper',
            children,
            sideOffset = 8,
            collisionPadding = 10,
            ...props
        },
        forwardedRef,
    ) => (
        <Portal>
            <Content
                ref={forwardedRef}
                className={cn(
                    // base
                    'relative z-50 overflow-hidden rounded-md border shadow-xl shadow-black/[2.5%]',
                    // widths
                    'min-w-[calc(var(--radix-select-trigger-width)-2px)] max-w-[95vw]',
                    // heights
                    'max-h-[--radix-select-content-available-height]',
                    // background color
                    'bg-white dark:bg-gray-950',
                    // text color
                    'text-gray-900 dark:text-gray-50',
                    // border color
                    'border-gray-300 dark:border-gray-800',
                    // transition
                    'will-change-[transform,opacity]',
                    'data-[state=closed]:animate-hide',
                    'data-[side=bottom]:animate-slideDownAndFade data-[side=left]:animate-slideLeftAndFade data-[side=right]:animate-slideRightAndFade data-[side=top]:animate-slideUpAndFade',
                    className,
                )}
                sideOffset={sideOffset}
                position={position}
                collisionPadding={collisionPadding}
                {...props}
            >
                <SelectScrollUpButton />
                <Viewport
                    className={cn(
                        'p-1',
                        position === 'popper' &&
                            'h-[var(--radix-select-trigger-height)] w-full min-w-[calc(var(--radix-select-trigger-width))]',
                    )}
                >
                    {children}
                </Viewport>
                <SelectScrollDownButton />
            </Content>
        </Portal>
    ),
);

SelectContent.displayName = 'SelectContent';
