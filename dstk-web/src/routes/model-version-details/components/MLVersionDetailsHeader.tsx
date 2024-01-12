import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

import { BreadcrumbItem, Breadcrumbs, Button } from '@/components/ui';
import { MLModelVersion } from '@/types/MLModelVersion';

type ModelVersionDetailsHeaderProps = {
    mlModelVersion: MLModelVersion;
};

export const ModelVersionDetailsHeader = ({ mlModelVersion }: ModelVersionDetailsHeaderProps) => {
    const { modelId, modelVersionId, numericVersion } = mlModelVersion;
    const navigate = useNavigate();

    return (
        <header className='flex flex-col gap-6'>
            <div>
                <Breadcrumbs>
                    <BreadcrumbItem href='/dashboard/home'>Dashboard</BreadcrumbItem>
                    <BreadcrumbItem href='/dashboard/models'>Models</BreadcrumbItem>
                    <BreadcrumbItem href={`/dashboard/models/${modelId.modelId}}`}>
                        {modelId.modelName}
                    </BreadcrumbItem>
                    <BreadcrumbItem href={`/dashboard/models/${modelId.modelId}/${modelVersionId}`}>
                        v{numericVersion}
                    </BreadcrumbItem>
                </Breadcrumbs>
            </div>
            <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-medium text-gray-700 sm:text-3xl'>Version Details</h2>
                <Button onClick={() => navigate('/dashboard/models/create')} icon={PlusCircleIcon}>
                    Add Files
                </Button>
            </div>
        </header>
    );
};
