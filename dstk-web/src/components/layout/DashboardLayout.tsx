import { RiMenuLine, RiMoonLine, RiSunLine } from '@remixicon/react';
import { Link, Outlet, useMatches, type UIMatch } from 'react-router-dom';

import { useTheme } from '@/providers';
import { useMediaQuery } from '@/hooks';
import { cn } from '@/lib';

import {
    Avatar,
    AvatarFallback,
    BreadcrumbElipssis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    Breadcrumbs,
    Button,
    Dropdown,
    DropdownContent,
    DropdownGroup,
    DropdownItem,
    DropdownTrigger,
} from '../ui';

const NAVIGATION = [
    {
        name: 'Home',
        to: '/dashboard/home',
    },
    {
        name: 'Model Registry',
        to: '/dashboard/models',
    },
    {
        name: 'Teams',
        to: '/dashboard/teams',
    },
    {
        name: 'Projects',
        to: '/dashboard/projects',
    },
];

export const DashboardLayout = () => {
    const { theme, setTheme } = useTheme();

    const shouldResize = useMediaQuery('(min-width: 1170px)');

    const matches = useMatches() as UIMatch<unknown, { crumb: (data?: unknown) => string }>[];
    const crumbs = matches
        .filter((match) => Boolean(match.handle))
        .map((match) => ({
            href: match.pathname,
            label: match.handle.crumb(),
        }));

    return (
        <div className='flex flex-col min-h-screen'>
            <div className='border-b border-gray-200 dark:border-gray-800'>
                <div className='px-4 sm:px-6 lg:px-8'>
                    <div className='flex items-center justify-between'>
                        <div className='flex h-16 sm:gap-7'>
                            <div className='hidden shrink-0 sm:flex sm:items-center'>
                                <Link to='/dashboard/home'>
                                    <img
                                        alt='dstk logo'
                                        aria-hidden={true}
                                        className='hidden dark:block w-auto h-5'
                                        src='/dstkLogoInverted.png'
                                    />
                                    <img
                                        alt='dstk logo'
                                        aria-hidden={true}
                                        className='block dark:hidden w-auto h-5'
                                        src='/dstkLogo.png'
                                    />
                                </Link>
                            </div>
                            <nav aria-label='Tabs' className='hidden sm:-mb-px sm:flex sm:gap-6'>
                                {NAVIGATION.map((item) => (
                                    <Link
                                        aria-current={
                                            item.to === matches.at(2)?.pathname ? 'page' : undefined
                                        }
                                        className={cn(
                                            item.to === matches.at(2)?.pathname
                                                ? 'border-gray-900 text-gray-900 dark:border-gray-50 dark:text-gray-50'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:dark:border-gray-400 hover:dark:text-gray-400',
                                            'inline-flex items-center whitespace-nowrap border-b-2 px-2 text-sm leading-5 font-medium',
                                        )}
                                        key={item.name}
                                        to={item.to}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                            <div className='flex items-center sm:hidden'>
                                <Dropdown>
                                    <DropdownTrigger asChild>
                                        <Button className='-ml-4' variant='ghost'>
                                            <RiMenuLine className='h-5 w-5' />
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownContent>
                                        <DropdownGroup>
                                            {NAVIGATION.map((item) => (
                                                <DropdownItem
                                                    asChild
                                                    className={cn(
                                                        item.to === matches.at(2)?.pathname
                                                            ? 'text-gray-900 dark:text-gray-50'
                                                            : 'text-gray-500 dark:text-gray-500 hover:text-gray-700 hover:dark:text-gray-400',
                                                    )}
                                                    key={item.name}
                                                >
                                                    <Link
                                                        aria-current={
                                                            item.to === matches.at(2)?.pathname
                                                                ? 'page'
                                                                : undefined
                                                        }
                                                        to={item.to}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </DropdownItem>
                                            ))}
                                        </DropdownGroup>
                                    </DropdownContent>
                                </Dropdown>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Dropdown>
                                <DropdownTrigger asChild>
                                    <Button variant='ghost'>
                                        <RiMoonLine className='hidden h-5 w-5 dark:block' />
                                        <RiSunLine className='block h-5 w-5 dark:hidden' />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownContent>
                                    <DropdownGroup>
                                        <DropdownItem
                                            className={cn(
                                                theme === 'system'
                                                    ? 'text-gray-50'
                                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-500 hover:dark:text-gray-400',
                                            )}
                                            onClick={() => setTheme('system')}
                                        >
                                            System
                                        </DropdownItem>
                                        <DropdownItem
                                            className={cn(
                                                theme === 'light'
                                                    ? 'text-gray-900'
                                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-500 hover:dark:text-gray-400',
                                            )}
                                            onClick={() => setTheme('light')}
                                        >
                                            Light
                                        </DropdownItem>
                                        <DropdownItem
                                            className={cn(
                                                theme === 'dark'
                                                    ? 'text-gray-50'
                                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-500 hover:dark:text-gray-400',
                                            )}
                                            onClick={() => setTheme('dark')}
                                        >
                                            Dark
                                        </DropdownItem>
                                    </DropdownGroup>
                                </DropdownContent>
                            </Dropdown>
                            <Dropdown>
                                <DropdownTrigger asChild>
                                    <Avatar className='hover:cursor-pointer'>
                                        <AvatarFallback>SO</AvatarFallback>
                                    </Avatar>
                                </DropdownTrigger>
                                <DropdownContent>
                                    <DropdownGroup>
                                        <DropdownItem>Sign Out</DropdownItem>
                                    </DropdownGroup>
                                </DropdownContent>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
            <div className='p-4 sm:p-6 lg:p-8'>
                <div className='flex flex-col gap-6'>
                    <Breadcrumbs>
                        <BreadcrumbList className={cn('flex-nowrap', shouldResize && 'hidden')}>
                            {crumbs.length > 1 ? (
                                <>
                                    <BreadcrumbItem>
                                        <Dropdown>
                                            <DropdownTrigger>
                                                <BreadcrumbElipssis className='h-4 w-4' />
                                                <span className='sr-only'>Toggle menu</span>
                                            </DropdownTrigger>
                                            <DropdownContent>
                                                <DropdownGroup>
                                                    {crumbs.slice(0, -1).map((crumb) => (
                                                        <DropdownItem key={crumb.href}>
                                                            <Link to={crumb.href}>
                                                                {crumb.label}
                                                            </Link>
                                                        </DropdownItem>
                                                    ))}
                                                </DropdownGroup>
                                            </DropdownContent>
                                        </Dropdown>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                </>
                            ) : (
                                <></>
                            )}
                            <BreadcrumbItem>
                                <BreadcrumbPage>{crumbs.at(-1)?.label}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                        <BreadcrumbList className={cn('flex-nowrap', !shouldResize && 'hidden')}>
                            {crumbs.map((crumb, index) => {
                                if (index === crumbs.length - 1) {
                                    return (
                                        <BreadcrumbPage key={crumb.href}>
                                            {crumb.label}
                                        </BreadcrumbPage>
                                    );
                                } else {
                                    return (
                                        <>
                                            <BreadcrumbLink key={crumb.href} to={crumb.href}>
                                                {crumb.label}
                                            </BreadcrumbLink>
                                            <BreadcrumbSeparator />
                                        </>
                                    );
                                }
                            })}
                        </BreadcrumbList>
                    </Breadcrumbs>
                    <main>
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};
