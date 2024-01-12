import { BreadcrumbItem, Breadcrumbs } from '@/components/ui';

export const CreateModelHeader = () => {
    return (
        <header className='flex flex-col gap-6'>
            <div>
                <Breadcrumbs>
                    <BreadcrumbItem href='/dashboard/home'>Dashboard</BreadcrumbItem>
                    <BreadcrumbItem href='/dashboard/models'>Models</BreadcrumbItem>
                    <BreadcrumbItem href='/dashboard/models/create'>Create</BreadcrumbItem>
                </Breadcrumbs>
            </div>
            <h2 className='text-2xl font-medium text-gray-700 sm:text-3xl'>Register New Model</h2>
        </header>
    );
};
