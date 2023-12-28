import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

import {
    BreadcrumbItem,
    Breadcrumbs,
    Button,
    Divider,
    Dropdown,
    DropdownItem,
    DropdownItems,
    Input,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
} from '@/components/ui';

import { useListModels } from './api/listModels';

export const ModelRegistry = () => {
    const navigate = useNavigate();

    const { data, loading, error, refetch } = useListModels();

    // TODO: Make UX Prettier
    if (error) return <p>Error: {error.message}</p>;

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
            {/* TODO: Add in indicator that lets user know there are no models current registered */}
            <div className='flex flex-col gap-4'>
                <div className='flex items-center justify-between'>
                    <div className='basis-1/4'>
                        <Input
                            onChange={(e) =>
                                refetch({
                                    modelName: e.target.value,
                                })
                            }
                            placeholder='Search Models'
                        />
                    </div>
                </div>
                {!loading ? (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell>Name</TableHeaderCell>
                                <TableHeaderCell>Total Versions</TableHeaderCell>
                                <TableHeaderCell>Created By</TableHeaderCell>
                                <TableHeaderCell>Last Modified</TableHeaderCell>
                                <TableHeaderCell>
                                    <span className='sr-only'>Model Registry Actions</span>
                                </TableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data &&
                                data.listMLModels &&
                                data.listMLModels.map((model) => (
                                    <TableRow
                                        className='hover:bg-gray-50 hover:cursor-pointer'
                                        key={model.modelId}
                                        onClick={() =>
                                            navigate(`/dashboard/models/${model.modelId}`)
                                        }
                                    >
                                        <TableCell className='font-medium text-gray-900'>
                                            {model.modelName}
                                        </TableCell>
                                        <TableCell>
                                            {(model.currentModelVersion &&
                                                model.currentModelVersion.numericVersion) ||
                                                0}
                                        </TableCell>
                                        <TableCell>{model.createdBy}</TableCell>
                                        <TableCell>{model.dateModified}</TableCell>
                                        <TableCell>
                                            <Dropdown
                                                menuButton={
                                                    <EllipsisHorizontalIcon className='h-6 w-6' />
                                                }
                                            >
                                                <DropdownItems>
                                                    <DropdownItem>Edit</DropdownItem>
                                                    <DropdownItem>Archive</DropdownItem>
                                                    <Divider />
                                                    <DropdownItem>Delete</DropdownItem>
                                                </DropdownItems>
                                            </Dropdown>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                ) : (
                    <BarLoader color='#4f46e5' width='250' />
                )}
            </div>
        </div>
    );
};
