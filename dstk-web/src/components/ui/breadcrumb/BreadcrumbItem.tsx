import { ChevronRightIcon } from '@heroicons/react/24/outline';

import { cn } from '@/lib/cn';

export type BreadcrumbItemProps = {
    children: React.ReactNode;
    href: string;
} & React.LiHTMLAttributes<HTMLLIElement>;

export const BreadcrumbItem = ({ children, className, href, ...props }: BreadcrumbItemProps) => {
    return (
        <li className={cn('group flex items-center gap-4', className)} {...props}>
            {/* Yeah I CSS like that */}
            <ChevronRightIcon className='group-first:hidden h-4 w-4 flex-shrink-0 text-gray-400' />
            <a className='text-sm font-medium text-gray-500 hover:text-gray-700' href={href}>
                {children}
            </a>
        </li>
    );
};
