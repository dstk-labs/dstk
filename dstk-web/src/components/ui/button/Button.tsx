import { cn } from '@/lib/cn';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva('font-semibold', {
    variants: {
        variant: {
            primary:
                'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
            secondary: 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
        },
        size: {
            xs: 'rounded px-2 py-1 text-xs',
            sm: 'rounded px-2 py-1 text-sm',
            md: 'rounded-md px-2.5 py-1.5 text-sm',
            lg: 'rounded-md px-3 py-2 text-sm',
            xl: 'rounded-md px-3.5 py-2.5 text-sm',
        },
    },
    defaultVariants: {
        variant: 'primary',
        size: 'md',
    },
});

export type ButtonProps = {
    children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof buttonVariants>;

export const Button = ({ children, className, size, variant, ...props }: ButtonProps) => {
    return (
        <button className={cn(buttonVariants({ size, variant, className }))} {...props}>
            {children}
        </button>
    );
};
