import { Controller, type Control } from 'react-hook-form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    type SelectProps,
} from '../ui';
import { FieldWrapper, type FieldPassThroughProps } from './FieldWrapper';

type Option = {
    id: string;
    label: string;
    value: string | number;
};

export type SelectFieldProps = {
    className?: string;
    control: Control<Record<string, unknown>> | undefined;
    name: string;
    onValueChange?: (value: string) => void;
    options?: Option[];
    placeholder?: string;
} & FieldPassThroughProps &
    Omit<SelectProps, 'className'>;

export const SelectField = ({
    className,
    control,
    defaultValue,
    disabled,
    error,
    name,
    label,
    onValueChange,
    options,
    placeholder,
    ...props
}: SelectFieldProps) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <FieldWrapper className={className} label={label} error={error}>
                    <Select
                        disabled={disabled}
                        onValueChange={(value) => {
                            field.onChange(value);
                            onValueChange && onValueChange(value);
                        }}
                    >
                        <SelectTrigger hasError={error !== undefined}>
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent {...props}>
                            {options &&
                                options.map((option) => (
                                    <SelectItem key={option.value} value={option.value.toString()}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </FieldWrapper>
            )}
        />
    );
};
