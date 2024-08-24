import {
    Badge,
    Button,
    Dropdown,
    DropdownContent,
    DropdownGroup,
    DropdownItem,
    DropdownSeparator,
    DropdownTrigger,
} from '@/components/ui';
import { ModelVersionsTable } from '@/features/model-version/components/ModelVersionsTable';
import { GET_MODEL } from '@/features/model/api/getModel';
import { ArchiveModelModal } from '@/features/model/components/ArchiveModelModal';
import { preloadQuery } from '@/lib';
import { Limit } from '@/types/filters';
import { useReadQuery } from '@apollo/client';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { useState, useTransition } from 'react';
import { Link, useLoaderData, type LoaderFunctionArgs } from 'react-router-dom';

export const modelLoader = async ({ params }: LoaderFunctionArgs) => {
    const modelId = params.modelId as string;

    return preloadQuery(GET_MODEL, {
        variables: { modelId: modelId },
    }).toPromise();
};

export const ModelVersionsRoute = () => {
    const queryRef = useLoaderData() as Awaited<ReturnType<typeof modelLoader>>;
    const { data } = useReadQuery(queryRef);

    const [continuationTokens, setContinuationTokens] = useState<(string | undefined)[]>([]);
    const [limit, setLimit] = useState<Limit>(10);
    const [isPending, startTransition] = useTransition();

    return (
        <section className='flex flex-col gap-12'>
            <div className='flex flex-col gap-2'>
                <div className='isolate flex flex-wrap justify-between gap-x-6 gap-y-4'>
                    <div className='flex gap-2'>
                        <h1 className='text-xl tracking-tight font-semibold text-gray-900 dark:text-gray-50'>
                            {data.getMLModel.modelName}
                        </h1>
                        {data.getMLModel.isArchived && <Badge variant='error'>Archived</Badge>}
                    </div>
                    <Dropdown>
                        <DropdownTrigger asChild>
                            <Button
                                variant='ghost'
                                className='aspect-square p-1.5 hover:border hover:border-gray-300 data-[state=open]:border-gray-300 data-[state=open]:bg-gray-50 hover:dark:border-gray-700 data-[state=open]:dark:border-gray-700 data-[state=open]:dark:bg-gray-900'
                            >
                                <EllipsisVerticalIcon
                                    className='size-4 shrink-0 text-gray-500 group-hover:text-gray-700 group-data-[state=open]:text-gray-700 group-hover:dark:text-gray-300 group-data-[state=open]:dark:text-gray-300'
                                    aria-hidden='true'
                                />
                            </Button>
                        </DropdownTrigger>
                        <DropdownContent align='end'>
                            <DropdownGroup>
                                <DropdownItem>Info</DropdownItem>
                            </DropdownGroup>
                            <DropdownSeparator />
                            <DropdownGroup>
                                <DropdownItem asChild disabled={data.getMLModel.isArchived}>
                                    <Link to='create'>Create New Version</Link>
                                </DropdownItem>
                                <DropdownItem disabled={data.getMLModel.isArchived}>
                                    Edit
                                </DropdownItem>
                                <ArchiveModelModal
                                    isArchived={data.getMLModel.isArchived}
                                    modelName={data.getMLModel.modelName}
                                    modelId={data.getMLModel.modelId}
                                />
                            </DropdownGroup>
                        </DropdownContent>
                    </Dropdown>
                </div>
                <div className='max-w-md'>
                    <p className='text-sm/6 text-gray-500'>{data.getMLModel.description}</p>
                </div>
            </div>
            <p className='text-red-600'>TODO: Model Deployment Statistics</p>
            <div className='flex flex-col gap-6'>
                <div className='sm:flex sm:items-center sm:justify-between sm:space-x-10'>
                    <div className='flex flex-col gap-1'>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-50'>
                            Model Versions
                        </h3>
                        <p className='text-sm/6 text-gray-500'>Overview of all model iterations</p>
                    </div>
                </div>
                <ModelVersionsTable
                    after={continuationTokens.at(-1)}
                    first={limit}
                    isPending={isPending}
                    modelId={data.getMLModel.modelId}
                    setContinuationTokens={setContinuationTokens}
                    setLimit={setLimit}
                    startTransition={startTransition}
                />
            </div>
        </section>
    );
};
