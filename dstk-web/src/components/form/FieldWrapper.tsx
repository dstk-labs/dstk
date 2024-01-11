import type { FieldError } from 'react-hook-form';

import { Label } from '../ui';

export type FieldWrapperProps = {
    error?: FieldError;
    label?: string;
} & React.LabelHTMLAttributes<HTMLLabelElement>;

export type FieldPassThroughProps = Pick<FieldWrapperProps, 'error' | 'label'>;

export const FieldWrapper = ({ children, className, error, label }: FieldWrapperProps) => {
    return (
        <div className='flex flex-col gap-3'>
            <div className='flex flex-col gap-2'>
                <Label className={className}>{label}</Label>
                <div>{children}</div>
            </div>
            {error?.message && <p className='text-sm text-red-500'>{error.message}</p>}
        </div>
    );
};
