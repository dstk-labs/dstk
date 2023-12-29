import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

import {
    Button,
    Modal,
    ModalBody,
    ModalContents,
    ModalFooter,
    ModalIcon,
    ModalTitle,
} from '@/components/ui';

export type ArchiveModalProps = {
    isOpen: boolean;
    onClose: () => void;
    modelName: string;
};

export const ArchiveModal = ({ isOpen, onClose, modelName }: ArchiveModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContents>
                <ModalIcon>
                    <ExclamationTriangleIcon className='h-6 w-6 text-red-600' />
                </ModalIcon>
                <ModalBody>
                    <ModalTitle>Archive {modelName}</ModalTitle>
                    <div className='pt-2'>
                        <p className='text-sm text-gray-500'>
                            Are you sure you want to archive this model? You will no longer be able
                            to perform edits.
                        </p>
                    </div>
                </ModalBody>
            </ModalContents>
            <ModalFooter>
                <Button size='lg' variant='destructive'>
                    Archive
                </Button>
                <Button size='lg' variant='secondary' onClick={onClose}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    );
};
