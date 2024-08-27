import { useCreateModel } from '../api/createModel';
import { LIST_MODELS } from '../api/listModels';
import { Form, InputField, SelectField, TextAreaField } from '@/components/form';
import { Button } from '@/components/ui';
import { LIMITS } from '@/constants';
import { preloadQuery } from '@/lib';
import { LIST_STORAGE_PROVIDERS } from '@/features/storage-provider/api/listStorageProviders';
import { LIST_TEAMS } from '@/features/team/api/listTeams';
import { useReadQuery } from '@apollo/client';
import { useListProjects } from '@/features/project/api/listProjects';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

const createModelInputSchema = z.object({
    description: z.string().min(1, 'Required'),
    modelName: z.string().min(1, 'Required'),
    projectId: z.string().min(1, 'Required'),
    storageProviderId: z.string().min(1, 'Required'),
    teamId: z.string().min(1, 'Required'),
});

type CreateModelInput = z.infer<typeof createModelInputSchema>;

export const createModelLoader = async () => {
    const storageProviderPreloader = preloadQuery(LIST_STORAGE_PROVIDERS);
    const teamsPreloader = preloadQuery(LIST_TEAMS);

    return {
        storageProviderPreloader: await storageProviderPreloader.toPromise(),
        teamsPreloader: await teamsPreloader.toPromise(),
    };
};

export const CreateModelForm = () => {
    const { storageProviderPreloader, teamsPreloader } = useLoaderData() as Awaited<
        ReturnType<typeof createModelLoader>
    >;
    const { data: storageProviders } = useReadQuery(storageProviderPreloader);
    const { data: teams } = useReadQuery(teamsPreloader);
    const [listProjects, { data: projects }] = useListProjects();
    const [createModel, { loading: createModelLoading }] = useCreateModel();

    const navigate = useNavigate();

    const onSubmit = (values: CreateModelInput) => {
        createModel({
            variables: {
                data: {
                    description: values.description,
                    modelName: values.modelName,
                    projectId: values.projectId,
                    storageProviderId: values.storageProviderId,
                },
            },
            onCompleted: (values) => {
                const modelName = values.createModel.modelName;

                navigate('/dashboard/models');
                toast.success(`${modelName} successfully created`);
            },
            refetchQueries: [
                {
                    query: LIST_MODELS,
                    variables: {
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
                    Create New Model
                </h1>
                <Form
                    className='grid grid-cols-1 gap-4 sm:grid-cols-6'
                    id='create-model'
                    onSubmit={(values) => onSubmit(values)}
                    schema={createModelInputSchema}
                >
                    {({ control, register, formState }) => (
                        <>
                            <InputField
                                className='col-span-full sm:col-span-3'
                                error={formState.errors['modelName']?.message}
                                label='Model Name'
                                registration={register('modelName')}
                            />
                            <SelectField
                                className='col-span-full sm:col-span-3'
                                control={control}
                                error={formState.errors['teamId']?.message}
                                label='Team'
                                onValueChange={(value) => {
                                    listProjects({ variables: { teamId: value } });
                                }}
                                options={teams.listTeams.map((team) => {
                                    return {
                                        label: team.name,
                                        id: team.teamId,
                                        value: team.teamId,
                                    };
                                })}
                                name='teamId'
                            />
                            <SelectField
                                className='col-span-full sm:col-span-3'
                                control={control}
                                error={formState.errors['storageProviderId']?.message}
                                label='Storage Provider'
                                options={storageProviders.listStorageProviders.map(
                                    (storageProvider) => {
                                        return {
                                            label: storageProvider.bucket,
                                            id: storageProvider.providerId,
                                            value: storageProvider.providerId,
                                        };
                                    },
                                )}
                                name='storageProviderId'
                            />
                            <SelectField
                                className='col-span-full sm:col-span-3'
                                control={control}
                                disabled={!projects || projects.listProjects.length === 0}
                                error={formState.errors['projectId']?.message}
                                label='Project'
                                options={projects?.listProjects.map((project) => {
                                    return {
                                        label: project.name,
                                        id: project.projectId,
                                        value: project.projectId,
                                    };
                                })}
                                placeholder={!projects ? 'Please select a team' : ''}
                                name='projectId'
                            />
                            <TextAreaField
                                className='col-span-full'
                                error={formState.errors['description']?.message}
                                label='Model Description'
                                rows={4}
                                registration={register('description')}
                            />
                        </>
                    )}
                </Form>
            </div>
            <div className='flex items-center justify-end space-x-4'>
                <Button onClick={() => navigate('/dashboard/models')} variant='secondary'>
                    Cancel
                </Button>
                <Button
                    disabled={createModelLoading}
                    form='create-model'
                    isLoading={createModelLoading}
                    type='submit'
                >
                    Create
                </Button>
            </div>
        </section>
    );
};
