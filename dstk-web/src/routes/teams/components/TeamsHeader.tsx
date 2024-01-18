import { type NavigateFunction } from 'react-router-dom';

import { BreadcrumbItem, Breadcrumbs, Button } from '@/components/ui';

type TeamsHeaderProps = {
    navigateFn: NavigateFunction;
};

export const TeamsHeader = ({ navigateFn }: TeamsHeaderProps) => {
    return (
        <header className='flex flex-col gap-6'>
            <div>
                <Breadcrumbs>
                    <BreadcrumbItem href='/dashboard/home'>Dashboard</BreadcrumbItem>
                    <BreadcrumbItem href='/teams'>Teams</BreadcrumbItem>
                </Breadcrumbs>
            </div>
            <div className='flex items-center justify-between gap-0'>
                <h2 className='text-2xl font-medium text-gray-700 sm:text-3xl'>Teams</h2>
                <Button onClick={() => navigateFn('/teams/create')}>Create New Team</Button>
            </div>
        </header>
    );
};
