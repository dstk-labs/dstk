import { Dialog } from '@headlessui/react';

export type ModalTitleProps = {
    children: React.ReactNode;
};

export const ModalTitle = ({ children }: ModalTitleProps) => {
    return (
        <Dialog.Title as='h3' className='text-base font-semibold leading-6 text-gray-900'>
            {children}
        </Dialog.Title>
    );
};
