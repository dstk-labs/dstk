import { DocumentIcon, FolderIcon } from '@heroicons/react/24/outline';
import { useAtom } from 'jotai';

import {
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
} from '@/components/ui';
import type { StorageProviderObjectList } from '@/types/StorageProvider';

import { listObjectsPaginationAtom } from '../atoms';
import { createDirectory } from '../lib';

type FileExplorerProps = {
    objects: StorageProviderObjectList;
};

export const FileExplorer = ({ objects }: FileExplorerProps) => {
    const [inputs, setInputs] = useAtom(listObjectsPaginationAtom);
    const files = createDirectory(objects);

    return (
        <Card>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableHeaderCell>Type</TableHeaderCell>
                        <TableHeaderCell>Name</TableHeaderCell>
                        <TableHeaderCell>Size (kb)</TableHeaderCell>
                        <TableHeaderCell>Last Modified</TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <>
                        {inputs.prefixes.length > 1 ? (
                            <TableRow
                                className='hover:bg-gray-100 hover:cursor-pointer'
                                onClick={() =>
                                    setInputs((values) => ({
                                        ...values,
                                        prefixes: values.prefixes.slice(0, -1),
                                    }))
                                }
                            >
                                <TableCell>
                                    <FolderIcon className='w-5 h-5' />
                                </TableCell>
                                <TableCell>..</TableCell>
                                <TableCell> </TableCell>
                                <TableCell> </TableCell>
                            </TableRow>
                        ) : null}
                        {files.directories.map((directory) => (
                            <TableRow
                                className='hover:bg-gray-100 hover:cursor-pointer'
                                onClick={() =>
                                    setInputs((values) => ({
                                        ...values,
                                        prefixes: [
                                            ...values.prefixes,
                                            directory.name.split('/')[0],
                                        ],
                                    }))
                                }
                                key={directory.name}
                            >
                                <TableCell>
                                    <FolderIcon className='w-5 h-5' />
                                </TableCell>
                                <TableCell>{directory.name.split('/')[0]}</TableCell>
                                <TableCell>{directory.size}</TableCell>
                                <TableCell>
                                    {new Date(directory.lastModified).toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                        ))}
                        {files.files.map((file) => (
                            <TableRow className='hover:bg-gray-100' key={file.name}>
                                <TableCell>
                                    <DocumentIcon className='w-5 h-5' />
                                </TableCell>
                                <TableCell>{file.name}</TableCell>
                                <TableCell>{file.size}</TableCell>
                                <TableCell>
                                    {new Date(file.lastModified).toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </>
                </TableBody>
            </Table>
        </Card>
    );
};
