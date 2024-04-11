import { Group } from '@radix-ui/react-dropdown-menu';

export type DropdownGroupProps = React.ComponentPropsWithoutRef<typeof Group>;

export const DropdownGroup = ({ children, ...props }: DropdownGroupProps) => {
    return <Group {...props}>{children}</Group>;
};
