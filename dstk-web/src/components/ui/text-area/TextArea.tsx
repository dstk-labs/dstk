import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib';

const textAreaVariants = cva(
    'block w-full rounded-lg border bg-white text-gray-700 placeholder-gray-400/70 text-sm shadow-sm px-4 py-2.5 focus:ring focus:outline-none focus:ring-opacity-40 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
    {
        variants: {
            variant: {
                primary: 'border-gray-200 focus:border-blue-400 focus:ring-blue-300',
                error: 'border-red-400 focus:border-red-400 focus:ring-red-300',
            },
        },
        defaultVariants: {
            variant: 'primary',
        },
    },
);

export type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
    VariantProps<typeof textAreaVariants>;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ className, variant, ...props }, ref) => {
        return (
            <textarea
                className={cn(textAreaVariants({ variant, className }))}
                ref={ref}
                {...props}
            />
        );
    },
);

TextArea.displayName = 'TextArea';
