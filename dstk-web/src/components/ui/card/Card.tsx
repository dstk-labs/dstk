import { cn } from '@/lib/cn';

export type CardProps = {
    children: React.ReactNode;
} & React.AllHTMLAttributes<HTMLDivElement>;

export const Card = ({ children, className, ...props }: CardProps) => {
    return (
        <div className={cn('overflow-hidden rounded-lg bg-white shadow', className)} {...props}>
            {children}
        </div>
    );
};
