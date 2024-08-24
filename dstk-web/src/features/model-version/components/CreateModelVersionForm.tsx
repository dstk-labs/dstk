import { Form, TextAreaField } from '@/components/form';
import { Button } from '@/components/ui';
import { LIMITS } from '@/constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { useCreateModelVersion } from '../api/createModelVersion';
import { LIST_MODEL_VERSIONS } from '../api/listModelVersions';

const createModelInputSchema = z.object({
    description: z.string().optional(),
});

type CreateModelInput = z.infer<typeof createModelInputSchema>;

export const CreateModelVersionForm = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const modelId = location.pathname.split('/').at(-2) as string;

    const [createModelVersion, { loading }] = useCreateModelVersion();

    const onSubmit = (values: CreateModelInput) => {
        createModelVersion({
            variables: {
                data: {
                    description: values.description,
                    modelId: modelId,
                },
            },
            onCompleted: (values) => {
                const modelVersionId = values.createModelVersion.modelVersionId;
                const numericVersion = values.createModelVersion.numericVersion;

                navigate(`/dashboard/models/${modelId}/${modelVersionId}`);
                toast.success(`Version ${numericVersion} successfully created`);
            },
            refetchQueries: [
                {
                    query: LIST_MODEL_VERSIONS,
                    variables: {
                        modelId: modelId,
                        first: LIMITS[0],
                    },
                },
            ],
        });
    };

    return (
        <section className='flex flex-col gap-2'>
            <div className='flex flex-col gap-12'>
                <h1 className='text-lg font-bold text-gray-900 dark:text-gray-50'>
                    Create New Model Version
                </h1>
                <Form
                    className='col-span-full flex flex-col gap-2'
                    id='create-model-version'
                    onSubmit={(values) => onSubmit(values)}
                    schema={createModelInputSchema}
                >
                    {({ register, formState }) => (
                        <TextAreaField
                            description='This field is optional'
                            error={formState.errors['description']?.message}
                            label='Model Description'
                            rows={4}
                            registration={register('description')}
                        />
                    )}
                </Form>
            </div>
            <div className='flex items-center justify-end space-x-4'>
                <Button
                    onClick={() => navigate(`/dashboard/models/${modelId}`)}
                    variant='secondary'
                >
                    Cancel
                </Button>
                <Button
                    disabled={loading}
                    form='create-model-version'
                    isLoading={loading}
                    type='submit'
                >
                    Create
                </Button>
            </div>
        </section>
    );
};
