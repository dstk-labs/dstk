import { Trigger } from '@radix-ui/react-dropdown-menu';

export type DropdownTriggerProps = React.ComponentPropsWithoutRef<typeof Trigger>;

export const DropdownTrigger = ({ children, ...props }: DropdownTriggerProps) => {
    return <Trigger {...props}>{children}</Trigger>;
};
