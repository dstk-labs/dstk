import { forwardRef } from 'react';

import { cn } from '@/lib';

export type DividerProps = React.ComponentPropsWithoutRef<'div'>;

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div
                className={cn(
                    // base
                    'mx-auto my-6 flex w-full items-center justify-between gap-3 text-sm',
                    // text color
                    'text-gray-500 dark:text-gray-500',
                    className,
                )}
                ref={ref}
                {...props}
            >
                {children ? (
                    <>
                        <div
                            className={cn(
                                // base
                                'h-[1px] w-full',
                                // background color
                                'bg-gray-200 dark:bg-gray-800',
                            )}
                        />
                        <div className='whitespace-nowrap text-inherit'>{children}</div>
                        <div
                            className={cn(
                                // base
                                'h-[1px] w-full',
                                // background color
                                'bg-gray-200 dark:bg-gray-800',
                            )}
                        />
                    </>
                ) : (
                    <div
                        className={cn(
                            // base
                            'h-[1px] w-full',
                            // backround color
                            'bg-gray-200 dark:bg-gray-800',
                        )}
                    />
                )}
            </div>
        );
    },
);
Divider.displayName = 'Divider';
