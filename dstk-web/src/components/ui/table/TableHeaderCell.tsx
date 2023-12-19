import { cn } from '@/lib/cn';

export type TableHeaderCellProps = {
    children: React.ReactNode;
} & React.ThHTMLAttributes<HTMLTableCellElement>;

export const TableHeaderCell = ({ children, className, ...props }: TableHeaderCellProps) => {
    return (
        <th
            className={cn(
                'text-gray-900 px-3 py-3.5 first:pl-4 first:pr-3 first:sm:pl-6',
                className,
            )}
            {...props}
        >
            {children}
        </th>
    );
};
