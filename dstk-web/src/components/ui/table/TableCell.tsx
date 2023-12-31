import { cn } from '@/lib/cn';

export type TableCellProps = {
    children: React.ReactNode;
} & React.TdHTMLAttributes<HTMLTableCellElement>;

export const TableCell = ({ children, className, ...props }: TableCellProps) => {
    return (
        <td className={cn('whitespace-nowrap text-gray-500 px-6 py-4', className)} {...props}>
            {children}
        </td>
    );
};
