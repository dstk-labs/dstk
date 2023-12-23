import { BreadcrumbItem, Breadcrumbs, Button, TextArea } from '@/components/ui';

export const CreateModelVersion = () => {
    return (
        <div className='w-full flex flex-col gap-12'>
            {/* Page Header */}
            <header className='flex flex-col gap-4'>
                <div>
                    <Breadcrumbs>
                        <BreadcrumbItem href='/dashboard/home'>Dashboard</BreadcrumbItem>
                        <BreadcrumbItem href='/dashboard/models'>Models</BreadcrumbItem>
                        <BreadcrumbItem href='/dashboard/models/1234'>
                            Housing Market Clustering
                        </BreadcrumbItem>
                        <BreadcrumbItem href='/dashboard/models/1234/create'>Create</BreadcrumbItem>
                    </Breadcrumbs>
                </div>
                <h2 className='text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>
                    Create New Model Version
                </h2>
            </header>
            <div className='flex flex-col gap-6'>
                <div className='flex flex-col'>
                    <h3 className='text-base font-semibold leading-7 text-gray-900'>
                        Add Model Description
                    </h3>
                    <p className='text-sm leading-6 text-gray-600'>
                        Provide an optional model description. The new model version will be
                        generated automatically.
                    </p>
                </div>
                <TextArea rows={4} defaultValue='' />
                <div className='flex items-center justify-end gap-4'>
                    <Button variant='secondary' size='lg'>
                        Cancel
                    </Button>
                    <Button size='lg'>Submit</Button>
                </div>
            </div>
        </div>
    );
};
