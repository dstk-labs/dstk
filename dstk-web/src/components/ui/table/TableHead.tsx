import { cn } from '@/lib/cn';

export type TableHeadProps = {
    children: React.ReactNode;
} & React.HTMLAttributes<HTMLTableSectionElement>;

export const TableHead = ({ children, className, ...props }: TableHeadProps) => {
    return (
        <thead className={cn('bg-gray-50', className)} {...props}>
            {children}
        </thead>
    );
};
