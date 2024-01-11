import { createElement } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';
import { MoonLoader } from 'react-spinners';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-3 font-medium shadow-sm border disabled:cursor-not-allowed',
    {
        variants: {
            variant: {
                primary:
                    'border-blue-600 bg-blue-600 text-white hover:border-blue-500 hover:bg-blue-500 focus:ring focus:ring-blue-200 disabled:border-blue-300 disabled:bg-blue-300',
                secondary:
                    'border-gray-300 bg-white text-gray-700 hover:bg-gray-100 focus:ring focus:ring-gray-100 disabled:border-gray-100 disabled:bg-gray-50 disabled:text-gray-400',
                ghost: 'border-transparent bg-transparent text-gray-700 shadow-none hover:bg-gray-100 disabled:bg-transparent disabled:text-gray-400',
                destructive:
                    'border-red-600 bg-red-600 text-white hover:border-red-500 hover:bg-red-500 focus:ring focus:ring-red-200 disabled:border-red-300 disabled:bg-red-300',
            },
            size: {
                xs: 'px-3 py-1 text-xs',
                sm: 'px-4 py-1.5 text-sm',
                md: 'px-5 py-2 text-sm',
                lg: 'px-6 py-2.5 text-base',
                xl: 'px-8 py-3 text-lg',
            },
            radius: {
                none: 'rounded-none',
                half: 'rounded-lg',
                full: 'rounded-full',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
            radius: 'half',
        },
    },
);

export type ButtonProps = {
    children?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof buttonVariants> &
    /* Discriminated union for loading state
       If loading, then button is disabled and icon is removed. */
    (| { loading?: true; icon?: undefined; disabled?: true }
        | { icon?: React.ElementType; loading?: false; disabled?: boolean }
    );

export const Button = ({
    children,
    className,
    icon,
    loading = false,
    radius,
    size,
    variant,
    ...props
}: ButtonProps) => {
    return (
        <button className={cn(buttonVariants({ radius, size, variant, className }))} {...props}>
            {icon && <div className='h-5 w-5'>{createElement(icon)}</div>}
            <MoonLoader color='white' loading={loading} size='12.5px' />
            {children}
        </button>
    );
};
