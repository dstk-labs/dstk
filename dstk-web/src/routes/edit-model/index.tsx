import { useLocation } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

import { useGetModel, useListStorageProviders } from '@/hooks';
import { EditModelForm, EditModelHeader } from './components';

export const EditModel = () => {
    const { pathname } = useLocation();
    const modelId = pathname.split('/')[pathname.split('/').length - 2];

    const { data: model, loading: modelLoading, error: modelError } = useGetModel(modelId);
    const {
        data: storageProviders,
        loading: storageProviderLoading,
        error: storageProviderError,
    } = useListStorageProviders();

    if (storageProviderLoading || modelLoading) {
        return <BarLoader color='#4f46e5' width='250px' />;
    }

    if (storageProviderError) {
        return <p>Failed to load Storage Providers.</p>;
    }

    if (modelError) {
        return <p>Failed to load Model information.</p>;
    }

    if (model && storageProviders) {
        return (
            <div className='w-full flex flex-col gap-8'>
                <EditModelHeader model={model.getMLModel} />
                <EditModelForm
                    model={model.getMLModel}
                    storageProviders={storageProviders.listStorageProviders}
                />
            </div>
        );
    } else return null;
};
