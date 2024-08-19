import { createContext, forwardRef } from 'react';
import { List } from '@radix-ui/react-tabs';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib';

type TabsListVariant = 'line' | 'solid';

export const TabsListVariantContext = createContext<TabsListVariant>('line');

export type TabsListProps = React.ComponentPropsWithoutRef<typeof List> & {
    variant?: TabsListVariant;
};

export const tabsListVariants = cva('items-center border-gray-200 dark:border-gray-800', {
    variants: {
        variant: {
            line: 'flex justify-start border-b',
            solid: cn(
                // base
                'inline-flex items-center justify-center rounded-md p-1',
                // background color
                'bg-gray-100 dark:bg-gray-800',
            ),
        },
    },
});

export const TabsList = forwardRef<React.ElementRef<typeof List>, TabsListProps>(
    ({ children, className, variant = 'line', ...props }, ref) => {
        return (
            <List className={cn(tabsListVariants({ variant, className }))} ref={ref} {...props}>
                <TabsListVariantContext.Provider value={variant}>
                    {children}
                </TabsListVariantContext.Provider>
            </List>
        );
    },
);
TabsList.displayName = 'TabsList';
