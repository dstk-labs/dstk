import { Label } from '../ui';

export type FieldWrapperProps = {
    description?: string;
    error?: string;
    label?: string;
} & React.LabelHTMLAttributes<HTMLLabelElement>;

export type FieldPassThroughProps = Pick<FieldWrapperProps, 'description' | 'error' | 'label'>;

export const FieldWrapper = ({
    children,
    className,
    description,
    error,
    label,
}: FieldWrapperProps) => {
    return (
        <div className='flex flex-col gap-3'>
            <div className='flex flex-col gap-2'>
                <Label className={className}>{label}</Label>
                <div>{children}</div>
                {description && (
                    <p className='text-xs text-gray-500 dark:text-gray-500'>
                        This field is optional
                    </p>
                )}
            </div>
            {error && <p className='text-sm text-red-500'>{error}</p>}
        </div>
    );
};
