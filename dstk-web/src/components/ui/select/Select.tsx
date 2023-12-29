import { cn } from '@/lib/cn';

export type SelectProps = {
    children: React.ReactNode;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = ({ children, className, ...props }: SelectProps) => {
    return (
        <select
            className={cn(
                'block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6',
                className,
            )}
            {...props}
        >
            {children}
        </select>
    );
};
