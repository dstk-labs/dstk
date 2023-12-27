import { cn } from '@/lib/cn';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { cva, type VariantProps } from 'class-variance-authority';

const inputVariants = cva(
    'block w-full rounded-md border-0 px-3 py-1.5 ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200',
    {
        variants: {
            variant: {
                default:
                    'text-gray-900 shadow-sm ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600',
                error: 'pr-10 text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
    VariantProps<typeof inputVariants>;

export const Input = ({ className, variant, ...props }: InputProps) => {
    return (
        <>
            <input className={cn(inputVariants({ variant, className }))} {...props} />
            {variant === 'error' ? (
                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
                    <ExclamationCircleIcon className='h-5 w-5 text-red-500' aria-hidden='true' />
                </div>
            ) : null}
        </>
    );
};
