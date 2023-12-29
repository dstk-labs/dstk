import { forwardRef } from 'react';

import { cn } from '@/lib/cn';

export type SelectProps = {
    children: React.ReactNode;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ children, className, ...props }, ref) => {
        return (
            <select
                className={cn(
                    'block w-full rounded-md border-0 px-3 py-2 ring-1 ring-inset text-gray-900 shadow-sm ring-gray-300 focus:ring-indigo-600 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6',
                    className,
                )}
                ref={ref}
                {...props}
            >
                {children}
            </select>
        );
    },
);

Select.displayName = 'Select';
