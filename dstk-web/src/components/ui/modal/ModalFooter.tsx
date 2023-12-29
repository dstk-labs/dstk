export type ModalFooterProps = {
    children: React.ReactNode;
};

export const ModalFooter = ({ children }: ModalFooterProps) => {
    return (
        <div className='bg-gray-50 gap-4 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
            {children}
        </div>
    );
};
