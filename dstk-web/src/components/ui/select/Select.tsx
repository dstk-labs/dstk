import { Root } from '@radix-ui/react-select';

export const Selectt = Root;
Selectt.displayName = 'Select';

export type SelectProps = React.ComponentPropsWithoutRef<typeof Root>;

export const Select = ({ children, ...props }: SelectProps) => {
    return <Root {...props}>{children}</Root>;
};
