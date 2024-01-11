import { cn } from '@/lib';

export type LabelProps = {
    children: React.ReactNode;
} & React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = ({ children, className, ...props }: LabelProps) => {
    return (
        <label className={cn('block text-sm text-gray-500', className)} {...props}>
            {children}
        </label>
    );
};
