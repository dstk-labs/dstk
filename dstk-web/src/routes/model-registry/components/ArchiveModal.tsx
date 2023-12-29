import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { BarLoader } from 'react-spinners';

import { useNotificationStore } from '@/stores';

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
    const { addNotification } = useNotificationStore();

    const [archiveModel, { loading }] = useArchiveModel();

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            {!loading ? (
                <>
                    <ModalContents>
                        <ModalIcon>
                            <ExclamationTriangleIcon className='h-6 w-6 text-red-600' />
                        </ModalIcon>
                        <ModalBody>
                            <ModalTitle>Archive {model.modelName}</ModalTitle>
                            <div className='pt-2'>
                                <p className='text-sm text-gray-500'>
                                    Are you sure you want to perform this action? Edits cannot be
                                    performed while a model is in an archived state.
                                </p>
                            </div>
                        </ModalBody>
                    </ModalContents>
                    <ModalFooter>
                        <Button
                            size='lg'
                            variant='destructive'
                            onClick={() => {
                                archiveModel({
                                    variables: {
                                        modelId: model.modelId,
                                    },
                                    onCompleted: onClose,
                                    onError: (error) =>
                                        addNotification({
                                            type: 'error',
                                            title: 'Error',
                                            children: error.message,
                                        }),
                                });
                            }}
                        >
                            Archive
                        </Button>
                        <Button size='lg' variant='secondary' onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </>
            ) : (
                <BarLoader color='#4f46e5' width='250' />
            )}
        </Modal>
    );
};
