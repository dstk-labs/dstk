import { BreadcrumbItem, Breadcrumbs } from '@/components/ui';

import type { MLModel } from '@/types/MLModel';

type EditModelHeaderProps = {
    model: MLModel;
};

export const EditModelHeader = ({ model }: EditModelHeaderProps) => {
    return (
        <header className='flex flex-col gap-6'>
            <div>
                <Breadcrumbs>
                    <BreadcrumbItem href='/dashboard/home'>Dashboard</BreadcrumbItem>
                    <BreadcrumbItem href='/dashboard/models'>Models</BreadcrumbItem>
                    <BreadcrumbItem href={`/dashboard/models/${model.modelId}`}>
                        {model.modelName}
                    </BreadcrumbItem>
                    <BreadcrumbItem href={`/dashboard/models/${model.modelId}/edit`}>
                        Edit
                    </BreadcrumbItem>
                </Breadcrumbs>
            </div>
            <h2 className='text-2xl font-medium text-gray-700 sm:text-3xl'>
                Edit {model.modelName}
            </h2>
        </header>
    );
};
