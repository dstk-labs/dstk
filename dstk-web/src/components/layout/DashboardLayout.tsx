import { Cog6ToothIcon, HomeIcon, SquaresPlusIcon } from '@heroicons/react/24/outline';
import { Outlet } from 'react-router-dom';

import { Sidebar, SidebarContent, SidebarLink, SidebarSection } from '../ui';

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
            <main className='flex-grow px-5 py-9 bg-gray-100 md:py-8'>
                <Outlet />
            </main>
        </div>
    );
};
