import { cn } from '@/lib/cn';

export type TableRowProps = {
    children: React.ReactNode;
} & React.HTMLAttributes<HTMLTableRowElement>;

export const TableRow = ({ children, className, ...props }: TableRowProps) => {
    return (
        <tr className={cn('text-sm text-left group', className)} {...props}>
            {children}
        </tr>
    );
};
