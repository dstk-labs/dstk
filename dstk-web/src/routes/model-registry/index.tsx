import { useNavigate } from 'react-router-dom';

import {
    BreadcrumbItem,
    Breadcrumbs,
    Button,
    StatusIcon,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
} from '@/components/ui';

export const ModelRegistry = () => {
    const navigate = useNavigate();
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
                        <TableHeaderCell>Deployments</TableHeaderCell>
                        <TableHeaderCell>Created By</TableHeaderCell>
                        <TableHeaderCell>Last Modified</TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow
                        className='hover:bg-gray-50 hover:cursor-pointer'
                        onClick={() => navigate('/dashboard/models/1234')}
                    >
                        <TableCell className='font-medium text-gray-900'>
                            Housing Market Clustering
                        </TableCell>
                        <TableCell>5</TableCell>
                        <TableCell>
                            <div className='flex flex-col gap-2'>
                                <div className='flex items-center gap-2'>
                                    <StatusIcon variant='success' />3 Active
                                </div>
                                <div className='flex items-center gap-2'>
                                    <StatusIcon variant='pending' />1 Pending
                                </div>
                                <div className='flex items-center gap-2'>
                                    <StatusIcon variant='archived' />1 Archived
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>Steve O</TableCell>
                        <TableCell>December 12th, 2023</TableCell>
                    </TableRow>
                    <TableRow className='hover:bg-gray-50 hover:cursor-pointer'>
                        <TableCell className='font-medium text-gray-900'>Employee Churn</TableCell>
                        <TableCell>3</TableCell>
                        <TableCell>
                            <div className='flex flex-col gap-2'>
                                <div className='flex items-center gap-2'>
                                    <StatusIcon variant='error' />3 Failed
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>Michael L</TableCell>
                        <TableCell>December 10th, 2023</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
};
