import { cn } from '@/lib/cn';

export type CardFooterProps = {
    children: React.ReactNode;
} & React.AllHTMLAttributes<HTMLDivElement>;

export const CardFooter = ({ children, className, ...props }: CardFooterProps) => {
    return (
        <div className={cn('px-4 py-2 sm:px-6', className)} {...props}>
            {children}
        </div>
    );
};
