import { cn } from '@/lib/cn';

export type TableCellProps = {
    children: React.ReactNode;
} & React.TdHTMLAttributes<HTMLTableCellElement>;

export const TableCell = ({ children, className, ...props }: TableCellProps) => {
    return (
        <td
            className={cn(
                'whitespace-nowrap text-gray-500 px-3 py-4 first:pl-4 first:pr-3 first:sm:pl-6',
                className,
            )}
            {...props}
        >
            {children}
        </td>
    );
};
