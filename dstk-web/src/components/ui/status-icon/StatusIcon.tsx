import { cn } from '@/lib/cn';
import { cva, type VariantProps } from 'class-variance-authority';

const statusIconVariants = cva('flex-none rounded-full p-1', {
    variants: {
        variant: {
            success: 'text-green-400 bg-green-400/10',
            pending: 'text-blue-400 bg-blue-400/10',
            error: 'text-red-400 bg-red-400/10',
            archived: 'text-gray-500 bg-gray-100/10',
        },
    },
    defaultVariants: {
        variant: 'success',
    },
});

export type StatusIconProps = VariantProps<typeof statusIconVariants>;

export const StatusIcon = ({ variant }: StatusIconProps) => {
    return (
        <div className={cn(statusIconVariants({ variant }))}>
            <div className='h-2 w-2 rounded-full bg-current' />
        </div>
    );
};
