import { cn } from '@/lib';

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export const Skeleton = ({ children, className, ...props }: SkeletonProps) => {
    return (
        <div
            className={cn('animate-pulse rounded-md bg-gray-50 dark:bg-gray-900/60', className)}
            {...props}
        >
            {children}
        </div>
    );
};
