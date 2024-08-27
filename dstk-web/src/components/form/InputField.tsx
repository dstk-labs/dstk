import type { UseFormRegisterReturn } from 'react-hook-form';

import { Input, type InputProps } from '../ui';

import { FieldWrapper, type FieldPassThroughProps } from './FieldWrapper';

export type InputFieldProps = {
    className?: string;
    registration: Partial<UseFormRegisterReturn>;
} & FieldPassThroughProps &
    Omit<InputProps, 'className'>;

export const InputField = ({
    className,
    error,
    label,
    registration,
    type,
    ...props
}: InputFieldProps) => {
    return (
        <FieldWrapper className={className} label={label} error={error}>
            <Input hasError={error !== undefined} type={type} {...registration} {...props} />
        </FieldWrapper>
    );
};
