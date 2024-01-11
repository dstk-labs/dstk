import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { Form, InputField, SelectField, TextAreaField } from '@/components/form';
import { Button } from '@/components/ui';
import type { MLModel } from '@/types/MLModel';
import type { StorageProvider } from '@/types/StorageProvider';

import { useEditModel } from '../api';

const editModelInputSchema = z.object({
    description: z.string().optional(),
    modelName: z.string().min(1, 'Model Name is required.'),
    storageProviderId: z.string().uuid(),
});

type EditModelInput = z.infer<typeof editModelInputSchema>;

type EditModelFormProps = {
    model: MLModel;
    storageProviders: StorageProvider[];
};

export const EditModelForm = ({ model, storageProviders }: EditModelFormProps) => {
    const navigate = useNavigate();

    const [editModel, { loading }] = useEditModel();

    const onSubmit = async (data: EditModelInput) => {
        editModel({
            variables: {
                data: {
                    description: data.description,
                    modelName: data.modelName,
                    storageProviderId: data.storageProviderId,
                },
                modelId: model.modelId,
            },
        });
    };

    return (
        <>
            <Form<EditModelInput, typeof editModelInputSchema>
                className='grid grid-cols-1 gap-x-6 gap-y-8 items-start sm:grid-cols-4'
                id='edit-model'
                onSubmit={onSubmit}
                schema={editModelInputSchema}
            >
                {({ register, formState }) => (
                    <>
                        <div className='sm:col-span-2'>
                            <SelectField
                                defaultValue={model.storageProvider.providerId}
                                error={formState.errors.storageProviderId}
                                label='Storage Provider'
                                options={storageProviders.map((storageProvider) => ({
                                    id: storageProvider.providerId,
                                    label: storageProvider.bucket,
                                    value: storageProvider.providerId,
                                }))}
                                registration={register('storageProviderId')}
                            />
                        </div>
                        <div className='sm:col-span-2'>
                            <InputField
                                defaultValue={model.modelName}
                                error={formState.errors.modelName}
                                label='Model Name'
                                registration={register('modelName')}
                            />
                        </div>
                        <div className='sm:col-span-4'>
                            <TextAreaField
                                defaultValue={model.description}
                                error={formState.errors.description}
                                label='Description'
                                registration={register('description')}
                                rows={4}
                            />
                        </div>
                    </>
                )}
            </Form>
            <div className='w-full flex items-center justify-end gap-4'>
                <Button variant='secondary' onClick={() => navigate(`/dashboard/models/`)}>
                    Cancel
                </Button>
                <Button form='edit-model' loading={loading} type='submit'>
                    Submit
                </Button>
            </div>
        </>
    );
};
