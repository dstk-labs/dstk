import { cn } from '@/lib';
import { Label, type LabelProps } from '../ui';

export type FieldWrapperProps = {
    className?: string;
    description?: string;
    error?: string;
    label?: string;
} & Omit<LabelProps, 'className'>;

export type FieldPassThroughProps = Pick<FieldWrapperProps, 'description' | 'error' | 'label'>;

export const FieldWrapper = ({
    children,
    className,
    description,
    error,
    label,
}: FieldWrapperProps) => {
    return (
        <div className={cn('flex flex-col gap-3', className)}>
            <div className='flex flex-col gap-2'>
                <Label>{label}</Label>
                <div>{children}</div>
                {description && (
                    <p className='text-xs text-gray-500 dark:text-gray-500'>{description}</p>
                )}
            </div>
            {error && <p className='text-sm text-red-500'>{error}</p>}
        </div>
    );
};
