import { BarLoader } from 'react-spinners';

import { useListStorageProviders } from '@/hooks';

import { CreateModelForm, CreateModelHeader } from './components';

export const CreateModel = () => {
    const { data, loading, error } = useListStorageProviders();

    if (loading) {
        return <BarLoader color='#4f46e5' width='250px' />;
    }

    if (error) {
        return <p>Failed to load Storage Providers.</p>;
    }

    if (data) {
        return (
            <div className='w-full flex flex-col gap-8'>
                <CreateModelHeader />
                <CreateModelForm storageProviders={data.listStorageProviders} />
            </div>
        );
    }
};
