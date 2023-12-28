import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';

export type DropdownItemsProps = {
    children: React.ReactNode;
};

export const DropdownItems = ({ children }: DropdownItemsProps) => {
    return (
        <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
        >
            <Menu.Items className='absolute right-0 z-10 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                {children}
            </Menu.Items>
        </Transition>
    );
};
