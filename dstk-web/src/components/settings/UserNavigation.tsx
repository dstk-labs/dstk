import { useLocation } from 'react-router-dom';

import { cn } from '@/lib';

const TABS = [
    { name: 'User Settings', href: '/settings' },
    { name: 'API Keys', href: '/settings/api-keys' },
    { name: 'Storage Providers', href: '/settings/storage-providers' },
];

export const UserNavigation = () => {
    const { pathname } = useLocation();

    return (
        <div className='border-b border-gray-200'>
            <nav className='flex gap-8'>
                {TABS.map((tab) => (
                    <a
                        key={tab.name}
                        href={tab.href}
                        className={cn(
                            'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium',
                            tab.href === pathname
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                        )}
                    >
                        {tab.name}
                    </a>
                ))}
            </nav>
        </div>
    );
};
