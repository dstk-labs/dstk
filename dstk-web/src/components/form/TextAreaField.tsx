import type { UseFormRegisterReturn } from 'react-hook-form';

import { TextArea, type TextAreaProps } from '../ui';

import { FieldWrapper, type FieldPassThroughProps } from './FieldWrapper';

type TextAreaFieldProps = {
    registration: Partial<UseFormRegisterReturn>;
} & FieldPassThroughProps &
    TextAreaProps;

export const TextAreaField = ({
    className,
    description,
    error,
    label,
    registration,
    ...props
}: TextAreaFieldProps) => {
    return (
        <FieldWrapper description={description} label={label} error={error}>
            <TextArea className={className} {...registration} {...props} />
        </FieldWrapper>
    );
};
