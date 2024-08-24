import {
    Button,
    DropdownItem,
    Input,
    Label,
    Modal,
    ModalClose,
    ModalContent,
    ModalDescription,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    ModalTrigger,
} from '@/components/ui';
import { useRef, useState } from 'react';
import { useArchiveModel } from '../api/archiveModel';
import { toast } from 'sonner';
import { GET_MODEL } from '../api/getModel';

export type ArchiveModelModalProps = {
    isArchived: boolean;
    modelId: string;
    modelName: string;
};

export const ArchiveModelModal = ({ isArchived, modelId, modelName }: ArchiveModelModalProps) => {
    const ref = useRef<HTMLButtonElement>(null);
    const [input, setInput] = useState('');

    const [archiveModel, { loading }] = useArchiveModel();

    const onSubmit = () => {
        archiveModel({
            variables: {
                modelId,
            },
            onCompleted: async (values) => {
                const modelName = values.archiveModel.modelName;
                toast.warning(`${modelName} has been archived`);
                ref?.current?.click();
            },
            refetchQueries: [
                {
                    query: GET_MODEL,
                    variables: {
                        modelId: modelId,
                    },
                },
            ],
        });
    };

    return (
        <Modal>
            <DropdownItem
                disabled={isArchived}
                onClick={(e) => {
                    e.preventDefault();
                    ref?.current?.click();
                }}
            >
                Archive
                <ModalTrigger ref={ref}>
                    <div></div>
                </ModalTrigger>
            </DropdownItem>
            <ModalContent className='sm:max-w-lg flex flex-col gap-4'>
                <ModalHeader>
                    <ModalTitle>Archive {modelName} ?</ModalTitle>
                    <ModalDescription className='mt-1 text-sm leading-6'>
                        Archiving will mark this model as read-only and no updates will be able to
                        be made to the model
                    </ModalDescription>
                </ModalHeader>
                <div className='flex flex-col gap-2'>
                    <Label className='font-medium'>{`To confirm, type "${modelName}" in the input below`}</Label>
                    <Input onChange={(e) => setInput(e.target.value)} value={input} />
                </div>
                <ModalFooter className='mt-6'>
                    <ModalClose>
                        <Button className='mt-2 sm:mt-0' variant='secondary'>
                            Cancel
                        </Button>
                    </ModalClose>
                    <ModalClose asChild>
                        <DropdownItem className='focus:bg-transparent dark:focus:bg-transparent'>
                            <Button
                                disabled={input !== modelName}
                                isLoading={loading}
                                onClick={() => onSubmit()}
                                variant='destructive'
                            >
                                Archive
                            </Button>
                        </DropdownItem>
                    </ModalClose>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
