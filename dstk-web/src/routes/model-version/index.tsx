import { useState } from 'react';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import { useLocation, useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

import { useGetModel } from '@/hooks';

import {
    BreadcrumbItem,
    Breadcrumbs,
    Button,
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    Tooltip,
} from '@/components/ui';

import { useListModelVersions } from './api';

export const ModelVersion = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const modelId = pathname.split('/')[pathname.split('/').length - 1];

    const { data: modelData, loading: modelLoading, error: modelError } = useGetModel(modelId);
    const {
        data: mlVersionData,
        loading: mlVersionLoading,
        error: mlVersionError,
    } = useListModelVersions(modelId);

    const [isTooltipHidden, setIsTooltipHidden] = useState(true);
    const [copiedVersionId, setCopiedVersionId] = useState('');

    const handleCopy = (modelVersion: string) => {
        if (isTooltipHidden) {
            setIsTooltipHidden(false);
            setCopiedVersionId(modelVersion);

            navigator.clipboard.writeText(modelVersion);

            setTimeout(() => {
                setIsTooltipHidden(true);
                setCopiedVersionId('');
            }, 750);
        }
    };

    const modelName = modelData && modelData.getMLModel && modelData.getMLModel.modelName;

    if (modelLoading || mlVersionLoading) return <BarLoader color='#4f46e5' width='250' />;

    // TODO: Better UX
    if (modelError) return <p>Error! {modelError.message}</p>;

    if (mlVersionError) return <p>Error! {mlVersionError.message}</p>;

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
                    </Breadcrumbs>
                </div>
                <div className='flex items-center justify-between gap-0'>
                    <h2 className='text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>
                        {modelName}
                    </h2>
                    <Button
                        onClick={() => navigate(`/dashboard/models/${modelId}/create`)}
                        size='lg'
                    >
                        Create New Version
                    </Button>
                </div>
            </header>
            <Card>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>Version ID</TableHeaderCell>
                            <TableHeaderCell>Version</TableHeaderCell>
                            <TableHeaderCell>Created By</TableHeaderCell>
                            <TableHeaderCell>Last Modified</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mlVersionData &&
                            mlVersionData.listMLModelVersions &&
                            mlVersionData.listMLModelVersions.map((mlVersion) => (
                                <TableRow key={mlVersion.modelVersionId}>
                                    <TableCell
                                        className='hover:text-gray-800 hover:cursor-pointer'
                                        onClick={() => handleCopy(mlVersion.modelVersionId)}
                                    >
                                        <Tooltip
                                            isVisible={
                                                !isTooltipHidden &&
                                                mlVersion.modelVersionId === copiedVersionId
                                            }
                                            message='Copied!'
                                        >
                                            <div className='flex items-center gap-1'>
                                                <div>
                                                    {mlVersion.modelVersionId.substring(0, 8)}...
                                                </div>
                                                <ClipboardIcon className='h-3 w-3 shrink-0 hover:text-gray-800 hover:cursor-pointer' />
                                            </div>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>{mlVersion.numericVersion}</TableCell>
                                    <TableCell>{mlVersion.createdBy.userName}</TableCell>
                                    <TableCell>{mlVersion.dateCreated}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
};
