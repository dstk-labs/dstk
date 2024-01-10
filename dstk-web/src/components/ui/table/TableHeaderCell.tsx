import { cn } from '@/lib/cn';

export type TableHeaderCellProps = {
    children: React.ReactNode;
} & React.ThHTMLAttributes<HTMLTableCellElement>;

export const TableHeaderCell = ({ children, className, ...props }: TableHeaderCellProps) => {
    return (
        <th className={cn('px-4 py-3.5 font-normal text-gray-500', className)} {...props}>
            {children}
        </th>
    );
};
