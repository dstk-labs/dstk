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

import { useArchiveModel } from '../api/archiveModel';

export type ArchiveModalProps = {
    isOpen: boolean;
    onClose: () => void;
    model: {
        modelId: string;
        modelName: string;
    };
};

export const ArchiveModal = ({ isOpen, onClose, model }: ArchiveModalProps) => {
    const [archiveModel, { loading }] = useArchiveModel();

    const handleArchive = () => {
        archiveModel({
            variables: {
                modelId: model.modelId,
            },
            onCompleted: onClose,
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContents>
                <ModalIcon>
                    <ExclamationTriangleIcon className='h-6 w-6 text-red-600' />
                </ModalIcon>
                <ModalBody>
                    <ModalTitle>Archive {model.modelName}</ModalTitle>
                    <div className='pt-2'>
                        <p className='text-sm text-gray-500'>
                            Are you sure you want to perform this action? Edits cannot be performed
                            while a model is in an archived state.
                        </p>
                    </div>
                </ModalBody>
            </ModalContents>
            <ModalFooter>
                <Button onClick={() => handleArchive()} loading={loading} variant='destructive'>
                    Archive
                </Button>
                <Button variant='secondary' onClick={onClose}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    );
};
