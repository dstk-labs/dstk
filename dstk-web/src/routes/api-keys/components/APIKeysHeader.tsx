import { BreadcrumbItem, Breadcrumbs } from '@/components/ui';

export const APIKeysHeader = () => {
    return (
        <header className='flex flex-col gap-3'>
            <Breadcrumbs>
                <BreadcrumbItem href='/settings'>Settings</BreadcrumbItem>
                <BreadcrumbItem href='/settings/api-keys'>API Keys</BreadcrumbItem>
            </Breadcrumbs>
            <h1 className='text-2xl font-medium text-gray-700 sm:text-3xl'>API Keys</h1>
        </header>
    );
};
