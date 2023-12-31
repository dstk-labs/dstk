import { Disclosure } from '@headlessui/react';
import { Bars3Icon, HomeIcon, SquaresPlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Outlet, useLocation } from 'react-router-dom';

import { cn } from '@/lib/cn';

const navigation = [
    {
        name: 'Home',
        href: '/dashboard/home',
        icon: HomeIcon,
    },
    {
        name: 'Model Registry',
        href: '/dashboard/models',
        icon: SquaresPlusIcon,
    },
];

export const DashboardLayout = () => {
    const location = useLocation();

    const checkSubrouteMatch = (route: string) => {
        return route.split('/')[2] === location.pathname.split('/')[2];
    };

    return (
        <div className='flex flex-col min-h-screen'>
            {/* Navbar */}
            <Disclosure as='header' className='bg-gray-800'>
                {({ open }) => (
                    <>
                        <div className='mx-auto max-w-7xl px-2 sm:px-8 lg:px-10'>
                            <div className='relative flex h-16 items-center justify-between'>
                                <div className='absolute inset-y-0 left-0 flex items-center md:hidden'>
                                    {/* Mobile menu button*/}
                                    <Disclosure.Button className='relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'>
                                        {open ? (
                                            <XMarkIcon
                                                className='block h-6 w-6'
                                                aria-hidden='true'
                                            />
                                        ) : (
                                            <Bars3Icon
                                                className='block h-6 w-6'
                                                aria-hidden='true'
                                            />
                                        )}
                                    </Disclosure.Button>
                                </div>

                                {/* Logo */}
                                <div className='flex flex-1 items-center justify-center md:items-stretch md:justify-start'>
                                    <span className='text-white'>DSTK Logo</span>
                                </div>

                                {/* User Menu */}
                                <div className='absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0'>
                                    <span className='text-white'>User Menu</span>
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className='lg:hidden'>
                            <div className='flex flex-col gap-1 px-2 pb-3 pt-2'>
                                {navigation.map((navItem) => (
                                    <Disclosure.Button
                                        key={navItem.name}
                                        as='a'
                                        href={navItem.href}
                                        className={cn(
                                            'block rounded-md px-3 py-2 text-base font-medium',
                                            checkSubrouteMatch(navItem.href)
                                                ? 'bg-gray-900 text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                        )}
                                    >
                                        {navItem.name}
                                    </Disclosure.Button>
                                ))}
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>

            <div className='flex flex-grow'>
                {/* Sidebar */}
                <div className='hidden overflow-x-auto border-r border-gray-900/10 py-4 px-2 md:px-6 lg:px-8 md:block md:w-64 md:flex-none'>
                    <nav>
                        <ul className='flex flex-col gap-1'>
                            {navigation.map((navItem) => (
                                <li key={navItem.name}>
                                    <a
                                        href={navItem.href}
                                        className={cn(
                                            'group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold',
                                            checkSubrouteMatch(navItem.href)
                                                ? 'bg-gray-50 text-gray-800'
                                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50',
                                        )}
                                    >
                                        <navItem.icon
                                            className={cn(
                                                'h-6 w-6 shrink-0',
                                                checkSubrouteMatch(navItem.href)
                                                    ? 'text-gray-800'
                                                    : 'text-gray-400 group-hover:text-gray-800',
                                            )}
                                            aria-hidden='true'
                                        />
                                        {navItem.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                {/* Main Content */}
                <main className='flex-grow overflow-hidden bg-gray-100 px-4 py-6 sm:px-8'>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
