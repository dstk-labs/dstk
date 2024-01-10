import { cn } from '@/lib/cn';

export type TableCellProps = {
    children: React.ReactNode;
} & React.TdHTMLAttributes<HTMLTableCellElement>;

export const TableCell = ({ children, className, ...props }: TableCellProps) => {
    return (
        <td
            className={cn('px-4 py-4 text-sm text-gray-700 whitespace-nowrap', className)}
            {...props}
        >
            {children}
        </td>
    );
};
