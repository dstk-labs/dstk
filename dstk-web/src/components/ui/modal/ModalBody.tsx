export type ModalBodyProps = {
    children: React.ReactNode;
};

export const ModalBody = ({ children }: ModalBodyProps) => {
    return <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>{children}</div>;
};
