import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useAtom, useAtomValue } from 'jotai';

import {
    Button,
    Modal,
    ModalBody,
    ModalContents,
    ModalFooter,
    ModalIcon,
    ModalTitle,
} from '@/components/ui';

import { apiKeyIdAtom, archiveModalOpenAtom } from '../atoms';
import { useArchiveAPIKey } from '../api';

export const ArchiveModal = () => {
    const apiKeyId = useAtomValue(apiKeyIdAtom);
    const [archiveModalOpen, setArchiveModalOpen] = useAtom(archiveModalOpenAtom);

    const [archiveAPIKey, { loading }] = useArchiveAPIKey();

    const handleArchive = () => {
        archiveAPIKey({
            variables: {
                apiKeyId: apiKeyId,
            },
            onCompleted: () => handleClose(),
        });
    };

    const handleClose = () => setArchiveModalOpen(false);

    return (
        <Modal isOpen={archiveModalOpen} onClose={handleClose}>
            <ModalContents>
                <ModalIcon>
                    <ExclamationTriangleIcon className='h-6 w-6 text-red-600' />
                </ModalIcon>
                <ModalBody>
                    <ModalTitle>Archive API Key</ModalTitle>
                    <div className='pt-2'>
                        <p className='text-sm text-gray-500'>
                            Are you sure you want to proceed with this action?
                        </p>
                    </div>
                </ModalBody>
            </ModalContents>
            <ModalFooter>
                <Button onClick={() => handleArchive()} loading={loading} variant='destructive'>
                    Archive
                </Button>
                <Button variant='secondary' onClick={handleClose}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    );
};
