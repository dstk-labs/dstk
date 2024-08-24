import { cn } from '@/lib';
import { forwardRef } from 'react';

export type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    hasError?: boolean;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ className, hasError, ...props }: TextAreaProps, forwardedRef) => {
        return (
            <textarea
                ref={forwardedRef}
                className={cn(
                    // base
                    'flex min-h-[4rem] w-full rounded-md border px-3 py-1.5 shadow-sm outline-none transition-colors sm:text-sm',
                    // text color
                    'text-gray-900 dark:text-gray-50',
                    // border color
                    'border-gray-300 dark:border-gray-800',
                    // background color
                    'bg-white dark:bg-gray-950',
                    // placeholder color
                    'placeholder-gray-400 dark:placeholder-gray-500',
                    // disabled
                    'disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-300',
                    'disabled:dark:border-gray-700 disabled:dark:bg-gray-800 disabled:dark:text-gray-500',
                    // focus
                    'focus:ring-2 focus:ring-blue-200 focus:dark:ring-blue-700/30 focus:border-blue-500 focus:dark:border-blue-700',
                    // error
                    hasError
                        ? 'ring-2 border-red-500 dark:border-red-700 ring-red-200 dark:ring-red-700/30'
                        : '',
                    // invalid (optional)
                    'aria-[invalid=true]:dark:ring-red-400/20 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-200 aria-[invalid=true]:border-red-500 invalid:ring-2 invalid:ring-red-200 invalid:border-red-500',
                    className,
                )}
                {...props}
            />
        );
    },
);
TextArea.displayName = 'TextArea';
