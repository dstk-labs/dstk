import { useNavigate } from 'react-router-dom';

import {
    BreadcrumbItem,
    Breadcrumbs,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
} from '@/components/ui';

import { useListAllModelVersions } from './api/listAllModelVersions';

export const ModelRegistry = () => {
    const navigate = useNavigate();

    const { data, loading, error } = useListAllModelVersions();

    // TODO: Make UX Prettier
    if (error) return <p>Error: {error.message}</p>

    if (loading) return <p>Loading...</p>

    return (
        <div className='w-full flex flex-col gap-12'>
            {/* Page Header */}
            <header className='flex flex-col gap-4'>
                <div>
                    <Breadcrumbs>
                        <BreadcrumbItem href='/dashboard/home'>Dashboard</BreadcrumbItem>
                        <BreadcrumbItem href='/dashboard/models'>Models</BreadcrumbItem>
                    </Breadcrumbs>
                </div>
                <div className='flex items-center justify-between gap-0'>
                    <h2 className='text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>
                        Model Registry
                    </h2>
                    <Button size='lg'>Create</Button>
                </div>
            </header>
            <Table className='whitespace-nowrap overflow-x-scroll'>
                <TableHead>
                    <TableRow>
                        <TableHeaderCell>Name</TableHeaderCell>
                        <TableHeaderCell>Total Versions</TableHeaderCell>
                        <TableHeaderCell>Created By</TableHeaderCell>
                        <TableHeaderCell>Last Modified</TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data && data.listAllModelVersions && data.listAllModelVersions.map(modelVersion => (
                        <TableRow
                            className='hover:bg-gray-50 hover:cursor-pointer'
                            key={modelVersion.modelVersionId}
                            onClick={() => navigate(`/dashboard/models/${modelVersion.modelId.modelId}`)}
                        >
                            <TableCell className='font-medium text-gray-900'>{modelVersion.modelId.modelName}</TableCell>
                            <TableCell>{modelVersion.numericVersion}</TableCell>
                            <TableCell>{modelVersion.modelId.createdBy}</TableCell>
                            <TableCell>{modelVersion.modelId.dateModified}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
