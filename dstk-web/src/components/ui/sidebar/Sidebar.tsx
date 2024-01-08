export type SidebarProps = {
    children: React.ReactNode;
};

export const Sidebar = ({ children }: SidebarProps) => {
    return (
        <aside className='flex flex-col items-center gap-6 w-16 h-screen py-8 overflow-y-auto bg-white border-r md:items-start md:w-64 md:px-5'>
            {children}
        </aside>
    );
};
