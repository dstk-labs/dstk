import type { UseFormRegisterReturn } from 'react-hook-form';

import { Input, type InputProps } from '../ui';

import { FieldWrapper, type FieldPassThroughProps } from './FieldWrapper';

export type InputFieldProps = {
    registration: Partial<UseFormRegisterReturn>;
} & FieldPassThroughProps &
    InputProps;

export const InputField = ({
    className,
    error,
    label,
    registration,
    type,
    ...props
}: InputFieldProps) => {
    return (
        <FieldWrapper label={label} error={error}>
            <Input
                className={className}
                type={type}
                variant={error ? 'error' : 'default'}
                {...registration}
                {...props}
            />
        </FieldWrapper>
    );
};
