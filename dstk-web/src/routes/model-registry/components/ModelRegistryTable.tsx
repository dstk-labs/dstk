import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { useSetAtom } from 'jotai';
import type { NavigateFunction } from 'react-router-dom';

import {
    Button,
    Card,
    Divider,
    Dropdown,
    DropdownItem,
    DropdownItems,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
} from '@/components/ui';
import type { MLModelList } from '@/types/MLModel';

import { archiveModalOpenAtom, selectedModelAtom } from '../atoms';

type ModelRegistryTableProps = {
    data: MLModelList;
    navigateFn: NavigateFunction;
};

export const ModelRegistryTable = ({ data, navigateFn }: ModelRegistryTableProps) => {
    const setArchiveModalOpen = useSetAtom(archiveModalOpenAtom);
    const setSelectedModel = useSetAtom(selectedModelAtom);

    const handleEdit = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        model: (typeof data.listMLModels.edges)[number],
    ) => {
        e.stopPropagation();
        navigateFn(`/dashboard/models/${model.node.modelId}/edit`);
    };

    const handleArchive = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        model: (typeof data.listMLModels.edges)[number],
    ) => {
        e.stopPropagation();
        setSelectedModel({
            modelId: model.node.modelId,
            modelName: model.node.modelName,
        });
        setArchiveModalOpen(true);
    };

    return (
        <Card>
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
                    {data.listMLModels.edges.map((model) => (
                        <TableRow
                            className='hover:bg-gray-50 hover:cursor-pointer'
                            key={model.node.modelId}
                            onClick={() => navigateFn(`/dashboard/models/${model.node.modelId}`)}
                        >
                            <TableCell className='font-medium text-gray-800'>
                                {model.node.modelName}
                            </TableCell>
                            <TableCell>
                                {(model.node.currentModelVersion &&
                                    model.node.currentModelVersion.numericVersion) ||
                                    0}
                            </TableCell>
                            <TableCell>
                                <div className='flex gap-0.5 text-blue-600'>
                                    <div>@</div>
                                    <div className='hover:underline'>
                                        {model.node.createdBy.userName}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                {new Date(parseInt(model.node.dateModified)).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <Dropdown
                                    menuButton={
                                        <Button
                                            icon={EllipsisHorizontalIcon}
                                            size='xs'
                                            variant='ghost'
                                        />
                                    }
                                >
                                    <DropdownItems>
                                        <DropdownItem onClick={(e) => handleEdit(e, model)}>
                                            Edit
                                        </DropdownItem>
                                        <DropdownItem onClick={(e) => handleArchive(e, model)}>
                                            <span>Archive</span>
                                        </DropdownItem>
                                        <Divider />
                                        <DropdownItem className='text-blue-600 font-medium'>
                                            Publish
                                        </DropdownItem>
                                    </DropdownItems>
                                </Dropdown>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};
