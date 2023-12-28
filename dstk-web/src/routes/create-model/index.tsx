import { useState } from 'react';

import {
    BreadcrumbItem,
    Breadcrumbs,
    Input,
    Label,
    Select,
    SelectItem,
    TextArea,
} from '@/components/ui';

const storageProviders = ['Storage Provider 1', 'Storage Provider 2'];

export const CreateModel = () => {
    const [storageProvider, setStorageProvider] = useState(storageProviders[0]);

    return (
        <div className='w-full flex flex-col gap-12'>
            <header className='flex flex-col gap-4'>
                <div>
                    <Breadcrumbs>
                        <BreadcrumbItem href='/dashboard/home'>Dashboard</BreadcrumbItem>
                        <BreadcrumbItem href='/dashboard/models'>Models</BreadcrumbItem>
                        <BreadcrumbItem href='/dashboard/models/create'>Create</BreadcrumbItem>
                    </Breadcrumbs>
                </div>
                <h2 className='text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>
                    Register New Model
                </h2>
            </header>
            <form className='grid grid-cols-1 gap-x-6 gap-y-8 items-center sm:grid-cols-4'>
                <div className='flex flex-col gap-2 sm:col-span-2'>
                    <Label>Storage Provider</Label>
                    <Select value={storageProvider} onChange={setStorageProvider}>
                        {storageProviders.map((storageProvider) => (
                            <SelectItem key={storageProvider} value={storageProvider}>
                                {storageProvider}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
                <div className='flex flex-col gap-2 sm:col-span-2'>
                    <Label>Model Name</Label>
                    <Input />
                </div>
                <div className='flex flex-col gap-2 sm:col-span-4'>
                    <Label>Description</Label>
                    <TextArea rows={4} />
                </div>
            </form>
        </div>
    );
};
