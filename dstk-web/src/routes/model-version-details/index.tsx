import { useLocation } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

import { useGetMLModelVersion } from './api';
import { MLVersionMetadata, ModelVersionDetailsHeader } from './components';

export const ModelVersionDetails = () => {
    const { pathname } = useLocation();
    const versionId = pathname.split('/')[pathname.split('/').length - 1];

    const { data, loading, error } = useGetMLModelVersion(versionId);

    if (loading) {
        return <BarLoader color='#2563eb' width='250px' />;
    }

    if (error) {
        return <p>Error loading model information.</p>;
    }

    if (data) {
        return (
            <div className='w-full flex flex-col gap-12'>
                <ModelVersionDetailsHeader mlModelVersion={data.getMLModelVersion} />
                <MLVersionMetadata mlModelVersion={data.getMLModelVersion} />
                {/* TODO: File Explorer */}
            </div>
        );
    } else {
        return null;
    }
};
