import { cn } from '@/lib/cn';

export type TableBodyProps = {
    children: React.ReactNode;
} & React.HTMLAttributes<HTMLTableSectionElement>;

export const TableBody = ({ children, className, ...props }: TableBodyProps) => {
    return (
        <tbody className={cn('divide-y divide-gray-200 bg-white', className)} {...props}>
            {children}
        </tbody>
    );
};
