import { useNavigate, useParams } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

import { useGetModel } from '@/hooks';

import { useListModelVersions } from './api';
import {
    ModelVersionHeader,
    ModelVersionPagination,
    ModelVersionTable,
    NoModelVersionsFound,
} from './components';

export const ModelVersion = () => {
    const { modelId } = useParams();
    const navigate = useNavigate();

    const {
        data: modelData,
        loading: modelLoading,
        error: modelError,
    } = useGetModel(modelId || '');
    const {
        data: mlVersionData,
        loading: mlVersionLoading,
        error: mlVersionError,
    } = useListModelVersions(modelId || '');

    if (modelLoading || mlVersionLoading) {
        return <BarLoader color='#2563eb' width='250px' />;
    }

    if (modelError || mlVersionError) {
        return <NoModelVersionsFound />;
    }

    if (
        modelData &&
        modelData.getMLModel &&
        mlVersionData &&
        mlVersionData.listMLModelVersions &&
        mlVersionData.listMLModelVersions.pageInfo
    ) {
        return (
            <div className='w-full flex flex-col gap-12'>
                <ModelVersionHeader mlModel={modelData.getMLModel} navigateFn={navigate} />
                <div className='flex flex-col gap-6'>
                    <ModelVersionTable mlModelVersions={mlVersionData} navigateFn={navigate} />
                    <ModelVersionPagination
                        continuationToken={
                            mlVersionData.listMLModelVersions.pageInfo.continuationToken
                        }
                    />
                </div>
            </div>
        );
    } else {
        return null;
    }
};
