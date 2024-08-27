import type { UseFormRegisterReturn } from 'react-hook-form';

import { TextArea, type TextAreaProps } from '../ui';

import { FieldWrapper, type FieldPassThroughProps } from './FieldWrapper';

type TextAreaFieldProps = {
    className?: string;
    registration: Partial<UseFormRegisterReturn>;
} & FieldPassThroughProps &
    Omit<TextAreaProps, 'className'>;

export const TextAreaField = ({
    className,
    description,
    error,
    label,
    registration,
    ...props
}: TextAreaFieldProps) => {
    return (
        <FieldWrapper className={className} description={description} label={label} error={error}>
            <TextArea hasError={error !== undefined} {...registration} {...props} />
        </FieldWrapper>
    );
};
