import { cn } from '@/lib/cn';
import { Menu } from '@headlessui/react';

export type DropdownItemProps = {
    children: React.ReactNode;
};

export const DropdownItem = ({ children }: DropdownItemProps) => {
    return (
        <Menu.Item>
            {({ active }) => (
                <button
                    className={cn(
                        active ? 'bg-gray-100' : '',
                        'block w-full text-left px-4 py-2 text-sm text-gray-700',
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </button>
            )}
        </Menu.Item>
    );
};
