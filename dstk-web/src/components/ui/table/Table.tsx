import { cn } from '@/lib/cn';

export type TableProps = {
    children: React.ReactNode;
} & React.TableHTMLAttributes<HTMLTableElement>;

export const Table = ({ children, className, ...props }: TableProps) => {
    return (
        <div
            className={cn(
                'overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg',
                className,
            )}
            {...props}
        >
            <table className='w-full divide-y divide-gray-300'>{children}</table>
        </div>
    );
};
