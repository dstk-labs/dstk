import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
    'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
    {
        variants: {
            variant: {
                Active: 'bg-green-50 text-green-700 ring-green-600/20',
                Error: 'bg-red-50 text-red-700 ring-red-600/10',
                Archived: 'bg-gray-50 text-gray-600 ring-gray-500/10',
                Pending: 'bg-blue-50 text-blue-700 ring-blue-700/10',
            },
        },
        defaultVariants: {
            variant: 'Archived',
        },
    },
);

export type BadgeProps = {
    children: React.ReactNode;
} & VariantProps<typeof badgeVariants>;

export const Badge = ({ children, variant }: BadgeProps) => {
    return <span className={badgeVariants({ variant })}>{children}</span>;
};
