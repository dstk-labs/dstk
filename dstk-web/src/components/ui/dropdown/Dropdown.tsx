import { Menu } from '@headlessui/react';

export type DropdownProps = {
    children: React.ReactNode;
    menuButton: React.ReactElement;
};

export const Dropdown = ({ children, menuButton }: DropdownProps) => {
    return (
        <Menu as='div'>
            <Menu.Button onClick={(e) => e.stopPropagation()}>{menuButton}</Menu.Button>
            {children}
        </Menu>
    );
};
