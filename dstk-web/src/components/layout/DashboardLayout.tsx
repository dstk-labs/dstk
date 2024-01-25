import { Cog6ToothIcon, HomeIcon, SquaresPlusIcon, UsersIcon } from '@heroicons/react/24/outline';
import { Outlet, useMatches, type UIMatch } from 'react-router-dom';

import {
    BreadcrumbItem,
    Breadcrumbs,
    Sidebar,
    SidebarContent,
    SidebarLink,
    SidebarSection,
} from '../ui';

const navigation = [
    {
        name: 'DASHBOARD',
        links: [
            {
                name: 'Home',
                href: '/dashboard/home',
                icon: <HomeIcon />,
            },
            {
                name: 'Model Registry',
                href: '/dashboard/models',
                icon: <SquaresPlusIcon />,
            },
        ],
    },
    {
        name: 'COLLABORATION',
        links: [
            {
                name: 'Teams',
                href: '/teams',
                icon: <UsersIcon />,
            },
        ],
    },
    {
        name: 'CUSTOMIZATION',
        links: [
            {
                name: 'Settings',
                href: '/settings',
                icon: <Cog6ToothIcon />,
            },
        ],
    },
];

export const DashboardLayout = () => {
    // Am I a frontend engineer yet?
    const matches = useMatches() as UIMatch<unknown, { crumb: (data?: unknown) => string }>[];

    const crumbs = matches
        .filter((match) => Boolean(match.handle))
        .map((match) => ({
            href: match.pathname,
            label: match.handle.crumb(),
        }));

    return (
        <div className='flex min-h-screen'>
            <Sidebar>
                <a href='/dashboard/home'>
                    <img className='w-auto h-7' src='/dstkLogo.png' alt='dstk logo' />
                </a>
                <SidebarContent>
                    {navigation.map((section) => (
                        <SidebarSection key={section.name} label={section.name}>
                            {section.links.map((link) => (
                                <SidebarLink key={link.href} href={link.href} icon={link.icon}>
                                    {link.name}
                                </SidebarLink>
                            ))}
                        </SidebarSection>
                    ))}
                </SidebarContent>
            </Sidebar>
            <section className='flex grow flex-col'>
                <div className='w-full'>
                    <Breadcrumbs>
                        {crumbs.map((crumb) => (
                            <BreadcrumbItem href={crumb.href} key={crumb.href}>
                                {crumb.label}
                            </BreadcrumbItem>
                        ))}
                    </Breadcrumbs>
                </div>
                <main className='flex-grow px-5 py-9 bg-gray-100 md:py-8'>
                    <Outlet />
                </main>
            </section>
        </div>
    );
};
