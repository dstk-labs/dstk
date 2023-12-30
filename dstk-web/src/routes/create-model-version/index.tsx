import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { z } from 'zod';

import { useNotificationStore } from '@/stores';

import { useGetModel } from '@/hooks';

import { BreadcrumbItem, Breadcrumbs, Button, TextArea } from '@/components/ui';

import { useCreateModelVersion } from './api/createModelVersion';
import { ErrorNotification } from './components';

const createModelInputSchema = z.object({
    description: z.string().optional(),
});

type CreateModelInput = z.infer<typeof createModelInputSchema>;

export const CreateModelVersion = () => {
    const [createModelVersion, { loading: createModelLoading }] = useCreateModelVersion();
    const { addNotification } = useNotificationStore();

    const navigate = useNavigate();

    const { pathname } = useLocation();
    const modelId = pathname.split('/')[pathname.split('/').length - 2];

    const { data, loading: modelIdLoading, error } = useGetModel(modelId);

    const modelName = data && data.getMLModel && data.getMLModel.modelName;

    const { register, handleSubmit } = useForm<CreateModelInput>({
        resolver: zodResolver(createModelInputSchema),
    });

    const onSubmit: SubmitHandler<CreateModelInput> = (data) => {
        createModelVersion({
            variables: {
                data: {
                    description: data.description,
                    modelId: modelId,
                },
            },
            onCompleted: (data) => {
                const modelId = data.createModelVersion.modelId.modelId;
                const modelVersionId = data.createModelVersion.modelVersionId;

                navigate(`/dashboard/models/${modelId}/${modelVersionId}`);
            },
            onError: (error) => {
                addNotification({
                    type: 'error',
                    title: 'Error',
                    children: <ErrorNotification message={error.message} />,
                });
            },
        });
    };

    if (modelIdLoading) return <BarLoader color='#4f46e5' width='250px' />;

    // Better UX
    if (error) return <p>Error! {error.message}</p>;

    return (
        <div className='w-full flex flex-col gap-12'>
            {/* Page Header */}
            <header className='flex flex-col gap-4'>
                <div>
                    <Breadcrumbs>
                        <BreadcrumbItem href='/dashboard/home'>Dashboard</BreadcrumbItem>
                        <BreadcrumbItem href='/dashboard/models'>Models</BreadcrumbItem>
                        <BreadcrumbItem href={`/dashboard/models/${modelId}`}>
                            {modelName}
                        </BreadcrumbItem>
                        <BreadcrumbItem href={`/dashboard/models/${modelId}/create`}>
                            Create
                        </BreadcrumbItem>
                    </Breadcrumbs>
                </div>
                <h2 className='text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>
                    Create New Model Version
                </h2>
            </header>
            {!createModelLoading ? (
                <div className='flex flex-col gap-6'>
                    <div className='flex flex-col'>
                        <h3 className='text-base font-semibold leading-7 text-gray-900'>
                            Add Model Description
                        </h3>
                        <p className='text-sm leading-6 text-gray-600'>
                            Provide an optional model description. The new model version will be
                            generated automatically.
                        </p>
                    </div>
                    <form className='flex flex-col gap-6' onSubmit={handleSubmit(onSubmit)}>
                        <TextArea rows={4} defaultValue='' {...register('description')} />
                        <div className='flex items-center justify-end gap-4'>
                            <Button
                                variant='secondary'
                                size='lg'
                                onClick={() => navigate(`/dashboard/models/${modelId}`)}
                            >
                                Cancel
                            </Button>
                            <Button size='lg' type='submit'>
                                Submit
                            </Button>
                        </div>
                    </form>
                </div>
            ) : (
                <BarLoader color='#4f46e5' width='250px' />
            )}
        </div>
    );
};
