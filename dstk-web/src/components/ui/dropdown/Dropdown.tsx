import { Root } from '@radix-ui/react-dropdown-menu';

export type DropdownProps = React.ComponentPropsWithoutRef<typeof Root>;

export const Dropdown = ({ children, ...props }: DropdownProps) => {
    return <Root {...props}>{children}</Root>;
};
