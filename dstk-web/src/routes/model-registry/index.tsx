import { useState } from 'react';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

import type { Limit } from '@/types/limit';

import {
    BreadcrumbItem,
    Breadcrumbs,
    Button,
    Card,
    CardFooter,
    Divider,
    Dropdown,
    DropdownItem,
    DropdownItems,
    Input,
    Select,
    SelectItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
} from '@/components/ui';

import { useListModels } from './api';

import { ArchiveModal } from './components';

export const ModelRegistry = () => {
    const [limit, setLimit] = useState<Limit>(10);
    const [offset, setOffset] = useState(0);

    const [selectedModel, setSelectedModel] = useState({
        modelId: '',
        modelName: '',
    });
    const [archiveModalOpen, setArchiveModalOpen] = useState(false);

    const navigate = useNavigate();

    const { data, loading, error, refetch } = useListModels(limit, offset);

    // TODO: Make UX Prettier
    if (error) return <p>Error: {error.message}</p>;

    return (
        <>
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
                        <Button onClick={() => navigate('/dashboard/models/create')} size='lg'>
                            Create
                        </Button>
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
                        <Select
                            className='basis-1/6'
                            onChange={(e) => setLimit(parseInt(e.target.value) as Limit)}
                        >
                            <SelectItem value='10'>10 Results</SelectItem>
                            <SelectItem value='25'>25 Results</SelectItem>
                            <SelectItem value='50'>50 Results</SelectItem>
                        </Select>
                    </div>
                    {!loading ? (
                        <Card>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableHeaderCell>Name</TableHeaderCell>
                                        <TableHeaderCell className='text-right'>
                                            Total Versions
                                        </TableHeaderCell>
                                        <TableHeaderCell className='text-right'>
                                            Created By
                                        </TableHeaderCell>
                                        <TableHeaderCell className='text-right'>
                                            Last Modified
                                        </TableHeaderCell>
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
                                                <TableCell className='text-right'>
                                                    {(model.currentModelVersion &&
                                                        model.currentModelVersion.numericVersion) ||
                                                        0}
                                                </TableCell>
                                                <TableCell className='text-right'>
                                                    {model.createdBy}
                                                </TableCell>
                                                <TableCell className='text-right'>
                                                    {model.dateModified}
                                                </TableCell>
                                                <TableCell className='text-right'>
                                                    <Dropdown
                                                        menuButton={
                                                            <EllipsisHorizontalIcon className='h-6 w-6' />
                                                        }
                                                    >
                                                        <DropdownItems>
                                                            <DropdownItem>
                                                                <a
                                                                    href={`/dashboard/models/${model.modelId}/edit`}
                                                                >
                                                                    Edit
                                                                </a>
                                                            </DropdownItem>
                                                            <DropdownItem>
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedModel({
                                                                            modelId: model.modelId,
                                                                            modelName:
                                                                                model.modelName,
                                                                        });
                                                                        setArchiveModalOpen(true);
                                                                    }}
                                                                >
                                                                    Archive
                                                                </button>
                                                            </DropdownItem>
                                                            <Divider />
                                                            <DropdownItem>
                                                                <span className='text-indigo-600 font-semibold'>
                                                                    Publish
                                                                </span>
                                                            </DropdownItem>
                                                        </DropdownItems>
                                                    </Dropdown>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                            <CardFooter>
                                <div className='flex items-center justify-between'>
                                    {/* Dummy values */}
                                    <p className='text-sm text-gray-700'>
                                        Showing <span className='font-medium'>1</span> to{' '}
                                        <span className='font-medium'>3</span> of{' '}
                                        <span className='font-medium'>3</span> results
                                    </p>
                                    <div className='flex items-center gap-x-3'>
                                        <Button
                                            variant='secondary'
                                            size='lg'
                                            onClick={() =>
                                                setOffset((offset) =>
                                                    offset > 0 ? offset - 1 : offset,
                                                )
                                            }
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant='secondary'
                                            size='lg'
                                            onClick={() => setOffset((offset) => offset + 1)}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    ) : (
                        <BarLoader color='#4f46e5' width='250' />
                    )}
                </div>
            </div>
            <ArchiveModal
                model={selectedModel}
                isOpen={archiveModalOpen}
                onClose={() => setArchiveModalOpen(false)}
            />
        </>
    );
};
