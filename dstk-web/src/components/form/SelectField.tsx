import type { UseFormRegisterReturn } from 'react-hook-form';

import { Select, type SelectProps } from '../ui';

import { FieldWrapper, type FieldPassThroughProps } from './FieldWrapper';

type Option = {
    id: string;
    label: string;
    value: string | number;
};

export type SelectFieldProps = {
    options: Option[];
    registration: Partial<UseFormRegisterReturn>;
} & FieldPassThroughProps &
    SelectProps;

export const SelectField = ({
    className,
    defaultValue,
    error,
    label,
    options,
    registration,
    ...props
}: SelectFieldProps) => {
    return (
        <FieldWrapper label={label} error={error}>
            <Select
                className={className}
                defaultValue={defaultValue}
                variant={error ? 'error' : 'primary'}
                {...registration}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.id} value={option.value.toString()}>
                        {option.label}
                    </option>
                ))}
            </Select>
        </FieldWrapper>
    );
};
