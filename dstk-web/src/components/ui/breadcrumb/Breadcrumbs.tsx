import { cn } from '@/lib/cn';

export type BreadcrumbsProps = {
    children: React.ReactNode;
} & React.OlHTMLAttributes<HTMLOListElement>;

export const Breadcrumbs = ({ children, className, ...props }: BreadcrumbsProps) => {
    return (
        <nav>
            <ol className={cn('flex items-center gap-4', className)} {...props}>
                {children}
            </ol>
        </nav>
    );
};
