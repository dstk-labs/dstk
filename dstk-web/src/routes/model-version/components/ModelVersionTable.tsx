import { useState } from 'react';
import type { NavigateFunction } from 'react-router-dom';

import {
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    Tooltip,
} from '@/components/ui';
import type { MLModelVersionList } from '@/types/MLModelVersion';
import { ClipboardIcon } from '@heroicons/react/24/outline';

type ModelVersionTableProps = {
    mlModelVersions: MLModelVersionList;
    navigateFn: NavigateFunction;
};

export const ModelVersionTable = ({ mlModelVersions, navigateFn }: ModelVersionTableProps) => {
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

    return (
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
                    {mlModelVersions.listMLModelVersions.edges.map((edge) => (
                        <TableRow
                            className='hover:bg-gray-50 hover:cursor-pointer'
                            onClick={() =>
                                navigateFn(
                                    `/dashboard/models/${edge.node.modelId.modelId}/${edge.node.modelVersionId}`,
                                )
                            }
                            key={edge.node.modelVersionId}
                        >
                            <TableCell>
                                <Tooltip
                                    isVisible={
                                        !isTooltipHidden &&
                                        edge.node.modelVersionId === copiedVersionId
                                    }
                                    message='Copied!'
                                >
                                    <div className='flex items-center gap-1 hover:text-gray-950'>
                                        <div>{edge.node.modelVersionId.substring(0, 8)}...</div>
                                        <ClipboardIcon
                                            className='h-3 w-3 shrink-0 hover:text-gray-950 hover:cursor-pointer'
                                            onClick={() => handleCopy(edge.node.modelVersionId)}
                                        />
                                    </div>
                                </Tooltip>
                            </TableCell>
                            <TableCell>{edge.node.numericVersion}</TableCell>
                            <TableCell>{edge.node.createdBy.userName}</TableCell>
                            <TableCell>
                                {new Date(parseInt(edge.node.dateCreated)).toLocaleDateString()}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};
