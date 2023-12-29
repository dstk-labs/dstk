import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { z } from 'zod';

import { useNotificationStore } from '@/stores';

import { useListStorageProviders } from '@/hooks';

import {
    BreadcrumbItem,
    Breadcrumbs,
    Button,
    Input,
    Label,
    Select,
    SelectItem,
    TextArea,
} from '@/components/ui';

import { useCreateModel } from './api';

const createModelInputSchema = z.object({
    description: z.string().optional(),
    modelName: z.string().min(1, 'Model Name is required.'),
    storageProviderId: z.string().uuid(),
});

type CreateModelInput = z.infer<typeof createModelInputSchema>;

export const CreateModel = () => {
    const [createModel, { loading: createModelLoading }] = useCreateModel();
    const {
        data: storageProviders,
        loading: storageProviderLoading,
        error,
    } = useListStorageProviders();

    const { addNotification } = useNotificationStore();
    const navigate = useNavigate();

    const { register, handleSubmit } = useForm<CreateModelInput>({
        resolver: zodResolver(createModelInputSchema),
    });

    const onSubmit: SubmitHandler<CreateModelInput> = (data) => {
        createModel({
            variables: {
                data: {
                    description: data.description,
                    modelName: data.modelName,
                    storageProviderId: data.storageProviderId,
                },
            },
            onCompleted: () => navigate('/dashboard/models'),
            onError: (error) =>
                addNotification({
                    type: 'error',
                    title: 'Error',
                    // TODO: Change this type to just be a string
                    children: error.message,
                }),
        });
    };

    if (storageProviderLoading) {
        return <BarLoader color='#4f46e5' width='250px' />;
    }

    // TODO: Change UX
    if (error) {
        return `Error! ${error.message}`;
    }

    return (
        <div className='w-full flex flex-col gap-12'>
            <header className='flex flex-col gap-4'>
                <div>
                    <Breadcrumbs>
                        <BreadcrumbItem href='/dashboard/home'>Dashboard</BreadcrumbItem>
                        <BreadcrumbItem href='/dashboard/models'>Models</BreadcrumbItem>
                        <BreadcrumbItem href='/dashboard/models/create'>Create</BreadcrumbItem>
                    </Breadcrumbs>
                </div>
                <h2 className='text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>
                    Register New Model
                </h2>
            </header>
            {!createModelLoading ? (
                <form
                    className='grid grid-cols-1 gap-x-6 gap-y-8 items-center sm:grid-cols-4'
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className='flex flex-col gap-2 sm:col-span-2'>
                        <Label>Storage Provider</Label>
                        <Select {...register('storageProviderId')}>
                            {storageProviders &&
                                storageProviders.listStorageProviders &&
                                storageProviders.listStorageProviders.map((storageProvider) => (
                                    <SelectItem
                                        key={storageProvider.providerId}
                                        value={storageProvider.providerId}
                                    >
                                        {storageProvider.bucket}
                                    </SelectItem>
                                ))}
                        </Select>
                    </div>
                    <div className='flex flex-col gap-2 sm:col-span-2'>
                        <Label>Model Name</Label>
                        <Input {...register('modelName')} />
                    </div>
                    <div className='flex flex-col gap-2 sm:col-span-4'>
                        <Label>Description</Label>
                        <TextArea rows={4} {...register('description')} />
                    </div>
                    <div className='col-span-4 flex items-center justify-end gap-4'>
                        <Button
                            variant='secondary'
                            size='lg'
                            onClick={() => navigate(`/dashboard/models/`)}
                        >
                            Cancel
                        </Button>
                        <Button size='lg' type='submit'>
                            Submit
                        </Button>
                    </div>
                </form>
            ) : (
                <BarLoader color='#4f46e5' width='250px' />
            )}
        </div>
    );
};
