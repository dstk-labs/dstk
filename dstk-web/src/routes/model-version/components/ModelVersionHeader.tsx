import { BreadcrumbItem, Breadcrumbs, Button } from '@/components/ui';
import type { NavigateFunction } from 'react-router-dom';

import type { MLModel } from '@/types/MLModel';

type ModelVersionHeaderProps = {
    mlModel: MLModel;
    navigateFn: NavigateFunction;
};

export const ModelVersionHeader = ({ mlModel, navigateFn }: ModelVersionHeaderProps) => {
    const { modelId, modelName } = mlModel;

    return (
        <header className='flex flex-col gap-4'>
            <div>
                <Breadcrumbs>
                    <BreadcrumbItem href='/dashboard/home'>Dashboard</BreadcrumbItem>
                    <BreadcrumbItem href='/dashboard/models'>Models</BreadcrumbItem>
                    <BreadcrumbItem href={`/dashboard/models/${modelId}`}>
                        {modelName}
                    </BreadcrumbItem>
                </Breadcrumbs>
            </div>
            <div className='flex items-center justify-between gap-0'>
                <h2 className='text-2xl font-medium text-gray-700 sm:text-3xl'>{modelName}</h2>
                <Button onClick={() => navigateFn(`/dashboard/models/${modelId}/create`)}>
                    Create New Version
                </Button>
            </div>
        </header>
    );
};
