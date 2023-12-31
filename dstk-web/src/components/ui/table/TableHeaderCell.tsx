import { cn } from '@/lib/cn';

export type TableHeaderCellProps = {
    children: React.ReactNode;
} & React.ThHTMLAttributes<HTMLTableCellElement>;

export const TableHeaderCell = ({ children, className, ...props }: TableHeaderCellProps) => {
    return (
        <th className={cn('px-6 py-3 font-semibold text-gray-900', className)} {...props}>
            {children}
        </th>
    );
};
