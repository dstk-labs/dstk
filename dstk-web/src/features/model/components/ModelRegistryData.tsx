import { RiBarChartFill, RiTimeLine } from '@remixicon/react';
import { useNavigate } from 'react-router-dom';

import { cn, getLastModified } from '@/lib';
import {
    Card,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRoot,
    TableRow,
} from '@/components/ui';
import { type Limit } from '@/types/filters';

import { TabsContent } from '@/components/ui/tabs';

import { useListModels } from '../api/listModels';
import { Pagination } from '@/components/pagination';

const NoModelsFound = () => {
    return (
        <div className='relative mt-4 flex h-72 items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700'>
            <div className='text-center'>
                <RiBarChartFill
                    className='mx-auto size-9 text-gray-400 dark:text-gray-600'
                    aria-hidden={true}
                />
                <div className='mt-2'>
                    <p className='text-md text-gray-700 dark:text-gray-300 font-medium'>
                        No Models Found
                    </p>
                    <p className='text-center text-sm text-gray-500 dark:text-gray-500'>
                        Please update the search criteria or create a new model.
                    </p>
                </div>
            </div>
        </div>
    );
};

const TABLE_HEADERS = ['Model Name', 'Current Model Version', 'Project', 'Last Modified'];

type ModelRegistryDataProps = {
    after?: string;
    first: Limit;
    isPending: boolean;
    modelName?: string;
    setContinuationTokens: React.Dispatch<React.SetStateAction<(string | undefined)[]>>;
    setLimit: React.Dispatch<React.SetStateAction<Limit>>;
    startTransition: React.TransitionStartFunction;
};

export const ModelRegistryData = ({
    after,
    first,
    isPending,
    modelName,
    setContinuationTokens,
    setLimit,
    startTransition,
}: ModelRegistryDataProps) => {
    const navigate = useNavigate();

    const { data } = useListModels({
        variables: {
            after,
            first,
            modelName,
        },
    });

    if (!data || data.listMLModels.edges.length === 0) {
        return <NoModelsFound />;
    }

    return (
        <>
            <Divider className='my-6' />
            <div className={cn(isPending && 'opacity-50')}>
                <TabsContent value='grid'>
                    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                        {data.listMLModels.edges.map((edge) => (
                            <Card
                                className='hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/60'
                                key={edge.node.modelId}
                                onClick={() => navigate(edge.node.modelId)}
                            >
                                <div className='flex items-center justify-between gap-4 text-sm text-gray-500'>
                                    <p>{edge.node.project.name}</p>
                                    <p>
                                        v
                                        {edge.node.currentModelVersion
                                            ? edge.node.currentModelVersion.numericVersion
                                            : 0}
                                    </p>
                                </div>
                                <p className='mt-3 truncate font-medium text-gray-900 dark:text-gray-50'>
                                    {edge.node.modelName}
                                </p>
                                <div className='mt-4 flex items-center gap-1.5'>
                                    <RiTimeLine
                                        aria-hidden={true}
                                        className='h-4 w-4 text-gray-400 dark:text-gray-600'
                                    />
                                    <span className='text-xs font-medium text-gray-500'>
                                        {getLastModified(edge.node.dateModified)}
                                    </span>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value='table'>
                    <TableRoot>
                        <Table>
                            <TableHead>
                                <TableRow className='border-b border-gray-200 dark:border-gray-800'>
                                    {TABLE_HEADERS.map((tableHeader) => (
                                        <TableHeaderCell className='text-nowrap' key={tableHeader}>
                                            {tableHeader}
                                        </TableHeaderCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.listMLModels.edges.map((edge) => (
                                    <TableRow
                                        className='hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/60'
                                        key={edge.node.modelId}
                                        onClick={() => navigate(edge.node.modelId)}
                                    >
                                        <TableCell>{edge.node.modelName}</TableCell>
                                        <TableCell>
                                            {(edge.node.currentModelVersion &&
                                                edge.node.currentModelVersion.numericVersion) ||
                                                0}
                                        </TableCell>
                                        <TableCell>{edge.node.project.name}</TableCell>
                                        <TableCell>
                                            {new Date(
                                                parseInt(edge.node.dateModified),
                                            ).toDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableRoot>
                </TabsContent>
                <Divider />
                <Pagination
                    continuationToken={data.listMLModels.pageInfo.continuationToken}
                    hasNextPage={data.listMLModels.pageInfo.hasNextPage}
                    hasPreviousPage={data.listMLModels.pageInfo.hasPreviousPage}
                    isPending={isPending}
                    limit={first}
                    setContinuationTokens={setContinuationTokens}
                    setLimit={setLimit}
                    startTransition={startTransition}
                />
            </div>
        </>
    );
};
