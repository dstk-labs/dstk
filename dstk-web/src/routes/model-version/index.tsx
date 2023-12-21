import { ClipboardIcon } from '@heroicons/react/24/outline';

import {
    Badge,
    BreadcrumbItem,
    Breadcrumbs,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    type BadgeProps,
} from '@/components/ui';

const models = [
    {
        versionId: '78f33d7c-dbe5-45e0-a49c-c9c54706b6f0',
        version: 5,
        deploymentStatus: 'Pending',
        createdBy: 'Steve O',
        lastModified: 'December 12th, 2023',
    },
    {
        versionId: '297e5931-c8d4-46a0-87ba-a210cdf8a9fd',
        version: 4,
        deploymentStatus: 'Active',
        createdBy: 'Steve O',
        lastModified: 'December 11th, 2023',
    },
    {
        versionId: '5f636561-12ab-43ef-aa90-416d15d33006',
        version: 3,
        deploymentStatus: 'Active',
        createdBy: 'Steve O',
        lastModified: 'December 10th, 2023',
    },
    {
        versionId: 'a8bc2d4d-0a11-4733-919c-4bf03e5b0262',
        version: 2,
        deploymentStatus: 'Active',
        createdBy: 'Steve O',
        lastModified: 'December 9th, 2023',
    },
    {
        versionId: 'b2425027-64d7-45a0-a91b-e6e4805841dd',
        version: 1,
        deploymentStatus: 'Archived',
        createdBy: 'Steve O',
        lastModified: 'December 8th, 2023',
    },
];

export const ModelVersion = () => {
    return (
        <div className='w-full flex flex-col gap-12'>
            {/* Page Header */}
            <header className='flex flex-col gap-4'>
                <div>
                    <Breadcrumbs>
                        <BreadcrumbItem href='/dashboard'>Dashboard</BreadcrumbItem>
                        <BreadcrumbItem href='/models'>Models</BreadcrumbItem>
                        <BreadcrumbItem href='/models/1234'>
                            Housing Market Clustering
                        </BreadcrumbItem>
                    </Breadcrumbs>
                </div>
                <div className='flex items-center justify-between gap-0'>
                    <h2 className='text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>
                        Housing Market Clustering
                    </h2>
                    <Button size='lg'>Create New Version</Button>
                </div>
            </header>
            <Table className='whitespace-nowrap overflow-x-scroll'>
                <TableHead>
                    <TableRow>
                        <TableHeaderCell>Version ID</TableHeaderCell>
                        <TableHeaderCell>Version</TableHeaderCell>
                        <TableHeaderCell>Deployment Status</TableHeaderCell>
                        <TableHeaderCell>Created By</TableHeaderCell>
                        <TableHeaderCell>Last Modified</TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {models.map((model) => (
                        <TableRow key={model.versionId}>
                            <TableCell
                                className='hover:text-gray-800 hover:cursor-pointer'
                                onClick={() => console.log('Text to copy:', model.versionId)}
                            >
                                <div className='flex items-center gap-1'>
                                    <div>{model.versionId.substring(0, 8)}...</div>
                                    <ClipboardIcon className='h-3 w-3 shrink-0 hover:text-gray-800 hover:cursor-pointer' />
                                </div>
                            </TableCell>
                            <TableCell>{model.version}</TableCell>
                            <TableCell>
                                <Badge
                                    variant={model.deploymentStatus as keyof BadgeProps['variant']}
                                >
                                    {model.deploymentStatus}
                                </Badge>
                            </TableCell>
                            <TableCell>{model.createdBy}</TableCell>
                            <TableCell>{model.lastModified}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
