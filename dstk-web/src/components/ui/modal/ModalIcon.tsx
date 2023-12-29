export type ModalIconProps = {
    children: React.ReactNode;
};

export const ModalIcon = ({ children }: ModalIconProps) => {
    return (
        <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
            {children}
        </div>
    );
};
