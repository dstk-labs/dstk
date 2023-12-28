import { cn } from '@/lib/cn';

export type LabelProps = {
    children: React.ReactNode;
} & React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = ({ children, className, ...props }: LabelProps) => {
    return (
        <label
            className={cn('block text-sm font-medium leading-6 text-gray-900', className)}
            {...props}
        >
            {children}
        </label>
    );
};
