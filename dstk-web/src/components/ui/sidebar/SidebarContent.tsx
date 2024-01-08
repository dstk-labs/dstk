export type SidebarContentProps = {
    children: React.ReactNode;
};

export const SidebarContent = ({ children }: SidebarContentProps) => {
    return <nav className='flex flex-col flex-1 gap-6 md:-mx-3'>{children}</nav>;
};
