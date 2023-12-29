export type ModalContentsProps = {
    children: React.ReactNode;
};

export const ModalContents = ({ children }: ModalContentsProps) => {
    return (
        <div className='bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
            <div className='sm:flex sm:items-start'>{children}</div>
        </div>
    );
};
