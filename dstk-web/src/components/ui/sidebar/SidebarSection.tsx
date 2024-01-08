export type SidebarSectionProps = {
    children: React.ReactNode;
    label?: string;
};

export const SidebarSection = ({ children, label }: SidebarSectionProps) => {
    return (
        <div className='flex flex-col gap-3'>
            <div className='px-3 hidden md:block'>
                <p className='text-xs text-gray-500'>{label}</p>
            </div>
            {children}
        </div>
    );
};
