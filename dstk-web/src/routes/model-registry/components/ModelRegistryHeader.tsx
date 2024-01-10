import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { type NavigateFunction } from 'react-router-dom';

import { BreadcrumbItem, Breadcrumbs, Button } from '@/components/ui';

type ModelRegistryHeaderProps = {
    navigateFn: NavigateFunction;
};

export const ModelRegistryHeader = ({ navigateFn }: ModelRegistryHeaderProps) => {
    return (
        <header className='flex flex-col gap-6'>
            <div>
                <Breadcrumbs>
                    <BreadcrumbItem href='/dashboard/home'>Dashboard</BreadcrumbItem>
                    <BreadcrumbItem href='/dashboard/models'>Models</BreadcrumbItem>
                </Breadcrumbs>
            </div>
            <div className='flex items-center justify-between gap-0'>
                <h2 className='text-2xl font-medium text-gray-700 sm:text-3xl'>Model Registry</h2>
                <Button
                    onClick={() => navigateFn('/dashboard/models/create')}
                    icon={PlusCircleIcon}
                >
                    Create
                </Button>
            </div>
        </header>
    );
};
