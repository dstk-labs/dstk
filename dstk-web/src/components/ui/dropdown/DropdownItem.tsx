import { cn } from '@/lib/cn';
import { Menu } from '@headlessui/react';

export type DropdownItemProps = {
    children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const DropdownItem = ({ children, className, ...props }: DropdownItemProps) => {
    return (
        <Menu.Item>
            {({ active }) => (
                <button
                    className={cn(
                        active ? 'bg-gray-100' : '',
                        'block w-full text-left px-4 py-2 text-sm text-gray-700',
                        className,
                    )}
                    {...props}
                >
                    {children}
                </button>
            )}
        </Menu.Item>
    );
};
