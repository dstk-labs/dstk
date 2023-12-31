import { cn } from '@/lib/cn';

export type TableProps = {
    children: React.ReactNode;
} & React.TableHTMLAttributes<HTMLTableElement>;

export const Table = ({ children, className, ...props }: TableProps) => {
    return (
        <table className={cn('min-w-full divide-y divide-gray-200', className)} {...props}>
            {children}
        </table>
    );
};
