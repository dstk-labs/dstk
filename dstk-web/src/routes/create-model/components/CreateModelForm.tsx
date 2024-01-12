import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { Form, InputField, SelectField, TextAreaField } from '@/components/form';
import type { StorageProvider } from '@/types/StorageProvider';

import { useCreateModel } from '../api';
import { Button } from '@/components/ui';

const createModelInputSchema = z.object({
    description: z.string().optional(),
    modelName: z.string().min(1, 'Model Name is required.'),
    storageProviderId: z.string().uuid(),
});

type CreateModelInput = z.infer<typeof createModelInputSchema>;

type CreateModelFormInput = {
    storageProviders: StorageProvider[];
};

export const CreateModelForm = ({ storageProviders }: CreateModelFormInput) => {
    const navigate = useNavigate();

    const [createModel, { loading }] = useCreateModel();

    const onSubmit = (data: CreateModelInput) => {
        createModel({
            variables: {
                data: {
                    description: data.description,
                    modelName: data.modelName,
                    storageProviderId: data.storageProviderId,
                },
            },
        });
    };

    return (
        <>
            <Form<CreateModelInput, typeof createModelInputSchema>
                className='grid grid-cols-1 gap-x-6 gap-y-8 items-start sm:grid-cols-4'
                id='create-model'
                onSubmit={onSubmit}
                schema={createModelInputSchema}
            >
                {({ register, formState }) => (
                    <>
                        <div className='sm:col-span-2'>
                            <SelectField
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
                                error={formState.errors.modelName}
                                label='Model Name'
                                registration={register('modelName')}
                            />
                        </div>
                        <div className='sm:col-span-4'>
                            <TextAreaField
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
                <Button form='create-model' loading={loading} type='submit'>
                    Submit
                </Button>
            </div>
        </>
    );
};
