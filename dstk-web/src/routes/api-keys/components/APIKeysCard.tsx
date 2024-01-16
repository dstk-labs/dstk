import { useState } from 'react';
import { ArchiveBoxIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import { useSetAtom } from 'jotai';

import { Button, Card, CardBody, CardHeader, Tooltip } from '@/components/ui';
import { APIKey } from '@/types/APIKey';

import { apiKeyIdAtom, archiveModalOpenAtom } from '../atoms';
import { useCreateAPIKey } from '../api';

type APIKeysTableProps = {
    apiKeys: APIKey[];
};

export const APIKeysCard = ({ apiKeys }: APIKeysTableProps) => {
    const setApiKeyId = useSetAtom(apiKeyIdAtom);
    const setArchiveModalOpen = useSetAtom(archiveModalOpenAtom);

    const [selectedApiKey, setSelectedApiKey] = useState('');
    const [isTooltipHidden, setIsTooltipHidden] = useState(true);

    const [createAPIKey, { loading }] = useCreateAPIKey();

    const handleArchiveClick = (apiKeyId: string) => {
        setApiKeyId(apiKeyId);
        setArchiveModalOpen(true);
    };

    const handleCopy = (apiKey: string) => {
        if (isTooltipHidden) {
            setIsTooltipHidden(false);
            setSelectedApiKey(apiKey);
            navigator.clipboard.writeText(apiKey);

            setTimeout(() => {
                setIsTooltipHidden(false);
                setSelectedApiKey('');
            }, 750);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className='flex items-center justify-between'>
                    <h2 className='text-xl font-medium leading-none tracking-tight'>API Keys</h2>
                    <Button onClick={() => createAPIKey()} loading={loading}>
                        Create New Key
                    </Button>
                </div>
            </CardHeader>
            <CardBody>
                <div className='flex flex-col gap-4'>
                    {apiKeys.map((apiKey) => (
                        <div key={apiKey.apiKeyId} className='flex items-center justify-between'>
                            <div className='flex flex-col'>
                                <p className='text-sm font-medium'>{apiKey.apiKey}</p>
                                <p className='text-sm text-gray-500'>
                                    Created: {new Date(parseInt(apiKey.dateCreated)).toDateString()}
                                </p>
                            </div>
                            <div className='flex items-center gap-2'>
                                <Tooltip
                                    isVisible={!isTooltipHidden && apiKey.apiKey === selectedApiKey}
                                    message='Copied!'
                                >
                                    <Button
                                        icon={ClipboardIcon}
                                        onClick={() => handleCopy(apiKey.apiKey)}
                                        variant='ghost'
                                    />
                                </Tooltip>
                                <Button
                                    icon={ArchiveBoxIcon}
                                    onClick={() => handleArchiveClick(apiKey.apiKeyId)}
                                    variant='ghost'
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
};
