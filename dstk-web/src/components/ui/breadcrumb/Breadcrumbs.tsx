import { forwardRef } from 'react';

export type BreadcrumbsProps = React.ComponentPropsWithoutRef<'nav'>;

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
    ({ children, ...props }, ref) => {
        return (
            <nav ref={ref} {...props}>
                {children}
            </nav>
        );
    },
);
Breadcrumbs.displayName = 'Breadcrumbs';
