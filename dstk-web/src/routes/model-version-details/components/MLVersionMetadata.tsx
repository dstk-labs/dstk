import { Card, CardBody, Label } from '@/components/ui';

import type { MLModelVersion } from '@/types/MLModelVersion';

type MLVersionMetadataProps = {
    mlModelVersion: MLModelVersion;
};

export const MLVersionMetadata = ({ mlModelVersion }: MLVersionMetadataProps) => {
    const { createdBy, description, modelId, numericVersion } = mlModelVersion;

    return (
        <Card>
            <CardBody>
                <div className='flex flex-col gap-4'>
                    <h2 className='text-xl text-gray-700'>Model Metadata</h2>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <Label>Model Name</Label>
                            <p className='text-gray-700'>{modelId.modelName}</p>
                        </div>
                        <div>
                            <Label>Version Number</Label>
                            <p className='text-gray-700'>v{numericVersion}</p>
                        </div>
                        <div>
                            <Label>Description</Label>
                            <p className='text-gray-700'>{description}</p>
                        </div>
                        <div>
                            <Label>Created By</Label>
                            <div className='flex gap-0.5 text-blue-600'>
                                <div>@</div>
                                <div className='hover:underline hover:cursor-pointer'>
                                    {createdBy.userName}
                                </div>
                            </div>
                        </div>
                        <div>
                            <Label>Last Updated</Label>
                            <p className='text-gray-700'>
                                {new Date(parseInt(modelId.dateModified)).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};
