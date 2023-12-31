import { cn } from '@/lib/cn';

export type CardBodyProps = {
    children: React.ReactNode;
} & React.AllHTMLAttributes<HTMLDivElement>;

export const CardBody = ({ children, className, ...props }: CardBodyProps) => {
    return (
        <div className={cn('px-4 py-2 sm:p-4', className)} {...props}>
            {children}
        </div>
    );
};
