import { zodResolver } from '@hookform/resolvers/zod';
import {
    useForm,
    type FieldValues,
    type SubmitHandler,
    type UseFormProps,
    type UseFormReturn,
} from 'react-hook-form';
import { ZodType, ZodTypeDef } from 'zod';

export type FormProps<TFormValues extends FieldValues, Schema> = {
    children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
    className?: string;
    id?: string;
    onSubmit: SubmitHandler<TFormValues>;
    options?: UseFormProps<TFormValues>;
    schema?: Schema;
};

export const Form = <
    TFormValues extends Record<string, unknown> = Record<string, unknown>,
    Schema extends ZodType<unknown, ZodTypeDef, unknown> = ZodType<unknown, ZodTypeDef, unknown>,
>({
    children,
    className,
    id,
    onSubmit,
    options,
    schema,
}: FormProps<TFormValues, Schema>) => {
    const methods = useForm<TFormValues>({ ...options, resolver: schema && zodResolver(schema) });

    return (
        <form className={className} id={id} onSubmit={methods.handleSubmit(onSubmit)}>
            {children(methods)}
        </form>
    );
};
