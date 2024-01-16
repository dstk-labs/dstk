import { cn } from '@/lib/cn';

export type CardHeaderProps = {
    children: React.ReactNode;
} & React.AllHTMLAttributes<HTMLDivElement>;

export const CardHeader = ({ children, className, ...props }: CardHeaderProps) => {
    return (
        <div className={cn('px-4 pt-6 pb-4', className)} {...props}>
            {children}
        </div>
    );
};
