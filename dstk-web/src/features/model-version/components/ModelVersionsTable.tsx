import { Link, useNavigate } from 'react-router-dom';
import { Pagination } from '@/components/pagination';
import {
    Badge,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRoot,
    TableRow,
} from '@/components/ui';
import { cn } from '@/lib';
import { type Limit } from '@/types/filters';
import { useListModelVersions } from '../api/listModelVersions';
import { format } from 'date-fns';
import { RiGitBranchLine } from '@remixicon/react';

const TABLE_HEADERS = ['Model Version', 'Created By', 'Date Created', 'Status'];

type ModelVersionsTableProps = {
    after?: string;
    first: Limit;
    isPending: boolean;
    modelId: string;
    setContinuationTokens: React.Dispatch<React.SetStateAction<(string | undefined)[]>>;
    setLimit: React.Dispatch<React.SetStateAction<Limit>>;
    startTransition: React.TransitionStartFunction;
};

// TODO: Should probably abstract this
const NoModelVersionsFound = () => {
    return (
        <div className='relative flex h-72 items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700'>
            <div className='text-center'>
                <RiGitBranchLine
                    className='mx-auto size-9 text-gray-400 dark:text-gray-600'
                    aria-hidden={true}
                />
                <div className='mt-2'>
                    <p className='text-md text-gray-700 dark:text-gray-300 font-medium'>
                        No Model Versions
                    </p>
                    <p className='text-center text-sm text-gray-500 dark:text-gray-500 text-gray-900 dark:text-white'>
                        <Link
                            className='font-medium text-blue-500 hover:text-blue-600 dark:text-blue-500 hover:dark:text-blue-600'
                            to='create'
                        >
                            Create
                        </Link>{' '}
                        a new one to get started
                    </p>
                </div>
            </div>
        </div>
    );
};

export const ModelVersionsTable = ({
    after,
    first,
    isPending,
    modelId,
    setContinuationTokens,
    setLimit,
    startTransition,
}: ModelVersionsTableProps) => {
    const navigate = useNavigate();

    const { data } = useListModelVersions({
        variables: {
            after,
            first,
            modelId,
        },
    });

    if (!data || data.listMLModelVersions.edges.length === 0) {
        return <NoModelVersionsFound />;
    }

    return (
        <div className={cn(isPending && 'opacity-50')}>
            <TableRoot>
                <Table className='border-transparent dark:border-transparent'>
                    <TableHead>
                        <TableRow className='[&_td:first-child]:pl-0 [&_th:first-child]:pl-0'>
                            {TABLE_HEADERS.map((tableHeader) => (
                                <TableHeaderCell className='text-nowrap pl-0' key={tableHeader}>
                                    {tableHeader}
                                </TableHeaderCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.listMLModelVersions.edges.map((edge) => (
                            <TableRow
                                className='hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/60 [&_td:first-child]:pl-0 [&_th:first-child]:pl-0'
                                key={edge.node.modelVersionId}
                                onClick={() => navigate(edge.node.modelVersionId)}
                            >
                                <TableCell className='pl-0'>{edge.node.numericVersion}</TableCell>
                                <TableCell className='pl-0'>
                                    {edge.node.createdBy.userName}
                                </TableCell>
                                <TableCell className='pl-0'>
                                    {format(
                                        new Date(parseInt(edge.node.dateCreated)),
                                        'yyyy-MM-dd',
                                    )}
                                </TableCell>
                                <TableCell className='pl-0'>
                                    <Badge variant={edge.node.isArchived ? 'error' : 'success'}>
                                        {edge.node.isArchived ? 'Archived' : 'Live'}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableRoot>
            <Divider />
            <Pagination
                continuationToken={data.listMLModelVersions.pageInfo.continuationToken}
                hasNextPage={data.listMLModelVersions.pageInfo.hasNextPage}
                hasPreviousPage={data.listMLModelVersions.pageInfo.hasPreviousPage}
                isPending={isPending}
                limit={first}
                setContinuationTokens={setContinuationTokens}
                setLimit={setLimit}
                startTransition={startTransition}
            />
        </div>
    );
};
