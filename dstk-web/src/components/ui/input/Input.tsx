import { createElement, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const inputVariants = cva(
    'block w-full shadow-sm pl-2 rounded-lg border bg-white placeholder-gray-400/70 text-gray-700 focus:outline-none focus:ring focus:ring-opacity-40 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
    {
        variants: {
            variant: {
                default: 'border-gray-200 focus:border-blue-400 focus:ring-blue-300',
                error: 'border-red-400 focus:border-red-400 focus:ring-red-300 focus:ring-opacity-40',
            },
            size: {
                xs: 'py-1 text-xs',
                sm: 'py-1.5 text-sm',
                md: 'py-2 text-sm',
                lg: 'py-2.5 text-base',
                xl: 'py-3 text-lg',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
        },
    },
);

export type InputProps = {
    icon?: React.ElementType;
} & React.InputHTMLAttributes<HTMLInputElement> &
    VariantProps<typeof inputVariants>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, icon, size, variant, ...props }, ref) => {
        return (
            <div className='relative flex items-center'>
                {icon && (
                    <div className='absolute w-5 h-5 mx-3 text-gray-400'>{createElement(icon)}</div>
                )}
                <input
                    className={cn(inputVariants({ size, variant, className }), icon ? 'pl-11' : '')}
                    ref={ref}
                    {...props}
                />
            </div>
        );
    },
);

Input.displayName = 'Input';
