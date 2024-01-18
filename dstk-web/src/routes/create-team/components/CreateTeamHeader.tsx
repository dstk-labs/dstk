import { BreadcrumbItem, Breadcrumbs } from '@/components/ui';

export const CreateTeamHeader = () => {
    return (
        <header className='flex flex-col gap-6'>
            <div>
                <Breadcrumbs>
                    <BreadcrumbItem href='/dashboard/home'>Dashboard</BreadcrumbItem>
                    <BreadcrumbItem href='/teams'>Teams</BreadcrumbItem>
                    <BreadcrumbItem href='/teams/create'>Create</BreadcrumbItem>
                </Breadcrumbs>
            </div>
            <h2 className='text-2xl font-medium text-gray-700 sm:text-3xl'>Register New Team</h2>
        </header>
    );
};
