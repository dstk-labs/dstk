import { cn } from '@/lib';
import { forwardRef } from 'react';

export const TableHead = forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, forwardedRef) => (
    <thead ref={forwardedRef} className={cn(className)} {...props} />
));
TableHead.displayName = 'TableHead';
