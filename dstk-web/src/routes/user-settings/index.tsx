import { UserNavigation } from '@/components/settings';
import { BreadcrumbItem, Breadcrumbs } from '@/components/ui';

export const UserSettings = () => {
    return (
        <div className='w-full flex flex-col gap-6'>
            <header className='flex flex-col gap-3'>
                <Breadcrumbs>
                    <BreadcrumbItem href='/settings'>Settings</BreadcrumbItem>
                </Breadcrumbs>
                <h1 className='text-2xl font-medium text-gray-700 sm:text-3xl'>User Settings</h1>
            </header>
            <UserNavigation />
        </div>
    );
};
