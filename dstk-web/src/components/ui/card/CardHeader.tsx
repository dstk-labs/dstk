import { cn } from '@/lib/cn';

export type CardHeaderProps = {
    children: React.ReactNode;
} & React.AllHTMLAttributes<HTMLDivElement>;

export const CardHeader = ({ children, className, ...props }: CardHeaderProps) => {
    return (
        <div className={cn('px-4 py-2 sm:px-6', className)} {...props}>
            {children}
        </div>
    );
};
